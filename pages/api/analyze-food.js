import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, userId } = req.body;

    if (!image || !userId) {
      return res.status(400).json({ error: 'Image and userId are required' });
    }

    // Verificar se usuário atingiu limite
    const { data: profile } = await supabase
      .from('profiles')
      .select('usage_count, is_premium')
      .eq('id', userId)
      .single();

    if (!profile.is_premium && profile.usage_count >= 3) {
      return res.status(403).json({ error: 'Limite de análises atingido' });
    }

    // Chamar OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de comida e retorne APENAS um JSON válido (sem markdown, sem \`\`\`json) com este formato exato:
{
  "foodName": "nome detalhado do prato",
  "calories": número_total_de_calorias,
  "protein": gramas_de_proteína,
  "carbs": gramas_de_carboidratos,
  "fat": gramas_de_gordura,
  "breakdown": [
    {"item": "nome do alimento com quantidade", "calories": número}
  ]
}

Seja preciso e detalhado na análise. Se não conseguir identificar a comida claramente, faça a melhor estimativa possível.`
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    let result;
    try {
      const content = response.choices[0].message.content.trim();
      // Remover possíveis markdown
      const cleanContent = content.replace(/```json\n?|\n?```/g, '');
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Erro ao parsear resposta:', parseError);
      return res.status(500).json({ error: 'Erro ao processar resposta da IA' });
    }

    // Salvar análise no banco
    const { data: analysis, error: dbError } = await supabase
      .from('meal_analyses')
      .insert({
        user_id: userId,
        food_name: result.foodName,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        breakdown: result.breakdown,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
    }

    // Atualizar contador de uso e XP
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        usage_count: profile.usage_count + 1,
        xp: (profile.xp || 0) + 50,
        total_calories: (profile.total_calories || 0) + result.calories,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro na análise:', error);
    return res.status(500).json({ 
      error: 'Erro ao analisar imagem',
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};