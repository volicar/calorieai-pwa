'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Dumbbell, Trophy, Zap, Crown, Moon, Sun, TrendingUp, Clock, Upload, Flame, Target, Award, Download } from 'lucide-react';

// Header Component
const Header = ({ darkMode, setDarkMode, isPremium }) => {
  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">CalorieAI</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-xl ${cardClasses} hover:scale-105 transition-transform`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {isPremium && (
          <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-yellow-600' : 'bg-yellow-500'} flex items-center gap-2`}>
            <Crown className="w-5 h-5 text-white" />
            <span className="font-semibold text-white">Premium</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ userStats, darkMode }) => {
  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  const xpPercentage = (userStats.xp % 100);

  return (
    <div className={`${cardClasses} rounded-3xl p-6 mb-6 shadow-2xl`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} flex items-center justify-center`}>
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm opacity-70">Nível</p>
          <p className="text-2xl font-bold">{userStats.level}</p>
        </div>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl ${darkMode ? 'bg-orange-600' : 'bg-orange-500'} flex items-center justify-center`}>
            <Flame className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm opacity-70">Sequência</p>
          <p className="text-2xl font-bold">{userStats.streak} dias</p>
        </div>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm opacity-70">Calorias</p>
          <p className="text-2xl font-bold">{userStats.totalCalories}</p>
        </div>
        <div className="text-center">
          <div className={`w-16 h-16 mx-auto mb-2 rounded-2xl ${darkMode ? 'bg-green-600' : 'bg-green-500'} flex items-center justify-center`}>
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm opacity-70">Treinos</p>
          <p className="text-2xl font-bold">{userStats.totalWorkouts}</p>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>XP Progress</span>
          <span>{userStats.xp % 100}/100</span>
        </div>
        <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Install Button Component
const InstallButton = ({ darkMode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstall(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuário aceitou instalar');
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  return (
    <div className={`${cardClasses} rounded-2xl p-4 mb-6 shadow-xl flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold">Instalar CalorieAI</p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Acesso rápido e offline
          </p>
        </div>
      </div>
      <button
        onClick={handleInstall}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-all"
      >
        Instalar
      </button>
    </div>
  );
};

// Upload Section Component
const UploadSection = ({ darkMode, selectedImage, handleImageUpload, analyzeImage, analyzing, usageCount, isPremium, openCamera }) => {
  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  const remainingUses = isPremium ? '∞' : Math.max(0, 3 - usageCount);

  return (
    <div className={`${cardClasses} rounded-3xl p-8 mb-6 shadow-2xl`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Camera className="w-6 h-6" />
          Analisar Refeição
        </h2>
        <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <span className="text-sm font-semibold">
            {remainingUses} análises restantes
          </span>
        </div>
      </div>

      <div className={`border-2 border-dashed rounded-2xl p-8 text-center ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
        {selectedImage ? (
          <div className="space-y-4">
            <img src={selectedImage} alt="Preview" className="max-w-full h-64 object-cover rounded-xl mx-auto" />
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                disabled={analyzing}
                className={`px-8 py-4 rounded-xl font-semibold text-white transition-all ${
                  analyzing 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105'
                }`}
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analisando com IA...
                  </span>
                ) : (
                  'Analisar Calorias'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Upload className={`w-16 h-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className="text-lg font-semibold">Escolha como enviar a foto</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <button
                onClick={openCamera}
                className={`${cardClasses} p-6 rounded-2xl hover:scale-105 transition-all flex flex-col items-center gap-3`}
              >
                <Camera className={`w-12 h-12 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className="font-semibold">Tirar Foto</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Abrir câmera
                </span>
              </button>
              
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className={`${cardClasses} p-6 rounded-2xl hover:scale-105 transition-all flex flex-col items-center gap-3 h-full`}>
                  <Upload className={`w-12 h-12 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                  <span className="font-semibold">Escolher da Galeria</span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG ou JPEG
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Workout Section Component
const WorkoutSection = ({ darkMode, workoutMinutes, setWorkoutMinutes, addWorkout }) => {
  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  return (
    <div className={`${cardClasses} rounded-3xl p-8 shadow-2xl`}>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Dumbbell className="w-6 h-6" />
        Registrar Treino
      </h2>
      
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Minutos de treino"
          value={workoutMinutes}
          onChange={(e) => setWorkoutMinutes(e.target.value)}
          className={`flex-1 px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} outline-none focus:ring-2 focus:ring-purple-500`}
        />
        <button
          onClick={addWorkout}
          className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition-all"
        >
          Adicionar
        </button>
      </div>
      
      <p className={`text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        💡 Ganhe XP registrando seus treinos!
      </p>
    </div>
  );
};

// Result View Component
const ResultView = ({ darkMode, result, setCurrentView, setSelectedImage }) => {
  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  return (
    <div className={`${cardClasses} rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">{result.foodName}</h2>
        <p className={`text-5xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          {result.calories} cal
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
          <p className="text-white text-sm opacity-90">Proteínas</p>
          <p className="text-white text-2xl font-bold">{result.protein}g</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
          <p className="text-white text-sm opacity-90">Carboidratos</p>
          <p className="text-white text-2xl font-bold">{result.carbs}g</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
          <p className="text-white text-sm opacity-90">Gorduras</p>
          <p className="text-white text-2xl font-bold">{result.fat}g</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Detalhamento:</h3>
        <div className="space-y-2">
          {result.breakdown.map((item, idx) => (
            <div key={idx} className={`flex justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <span>{item.item}</span>
              <span className="font-semibold">{item.calories} cal</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setCurrentView('home');
            setSelectedImage(null);
          }}
          className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-all"
        >
          Nova Análise
        </button>
      </div>
    </div>
  );
};

// Paywall View Component
const PaywallView = ({ darkMode, handleUpgrade, setCurrentView }) => {
  const cardClasses = darkMode
    ? 'bg-gray-800 bg-opacity-50 backdrop-blur-lg border border-gray-700'
    : 'bg-white bg-opacity-70 backdrop-blur-lg border border-gray-200';

  return (
    <div className={`${cardClasses} rounded-3xl p-8 shadow-2xl max-w-md mx-auto text-center`}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 mb-6">
        <Crown className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Upgrade para Premium</h2>
      <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Você usou suas 3 análises gratuitas!
      </p>

      <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl p-6 mb-6`}>
        <p className="text-4xl font-bold mb-2">R$ 9,90<span className="text-lg font-normal">/mês</span></p>
        <ul className="text-left space-y-3 mt-4">
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            Análises ilimitadas
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            Histórico completo
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            Metas personalizadas
          </li>
          <li className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            Suporte prioritário
          </li>
        </ul>
      </div>

      <button
        onClick={handleUpgrade}
        className="w-full px-8 py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:scale-105 transition-all mb-4"
      >
        Assinar Agora
      </button>

      <button
        onClick={() => setCurrentView('home')}
        className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:underline`}
      >
        Voltar
      </button>
    </div>
  );
};

// Main App Component
export default function CalorieTracker() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    totalCalories: 0,
    totalWorkouts: 0
  });
  const [workoutMinutes, setWorkoutMinutes] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const streamRef = React.useRef(null);

  useEffect(() => {
    const savedUsage = localStorage.getItem('usageCount');
    const savedPremium = localStorage.getItem('isPremium');
    const savedStats = localStorage.getItem('userStats');
    
    if (savedUsage) setUsageCount(parseInt(savedUsage));
    if (savedPremium) setIsPremium(savedPremium === 'true');
    if (savedStats) setUserStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    if (!isPremium && usageCount >= 3) {
      setCurrentView('paywall');
      return;
    }

    setAnalyzing(true);
    
    setTimeout(() => {
      const mockResult = {
        foodName: 'Prato com Arroz, Feijão e Frango',
        calories: 650,
        protein: 45,
        carbs: 72,
        fat: 18,
        breakdown: [
          { item: 'Arroz branco (1 xícara)', calories: 206 },
          { item: 'Feijão preto (1/2 xícara)', calories: 114 },
          { item: 'Peito de frango grelhado (150g)', calories: 248 },
          { item: 'Salada', calories: 82 }
        ]
      };

      setResult(mockResult);
      setAnalyzing(false);
      
      const newUsage = usageCount + 1;
      setUsageCount(newUsage);
      localStorage.setItem('usageCount', newUsage.toString());

      const newXP = userStats.xp + 50;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newStats = {
        ...userStats,
        xp: newXP,
        level: newLevel,
        totalCalories: userStats.totalCalories + mockResult.calories
      };
      setUserStats(newStats);
      localStorage.setItem('userStats', JSON.stringify(newStats));

      setCurrentView('result');
    }, 2500);
  };

  const addWorkout = () => {
    if (!workoutMinutes || workoutMinutes <= 0) return;

    const caloriesBurned = parseInt(workoutMinutes) * 8;
    const xpGained = parseInt(workoutMinutes) * 2;
    
    const newXP = userStats.xp + xpGained;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newStats = {
      ...userStats,
      xp: newXP,
      level: newLevel,
      totalWorkouts: userStats.totalWorkouts + 1,
      streak: userStats.streak + 1
    };
    
    setUserStats(newStats);
    localStorage.setItem('userStats', JSON.stringify(newStats));
    setWorkoutMinutes('');
    
    alert(`🔥 Treino registrado! ${caloriesBurned} calorias queimadas, +${xpGained} XP!`);
  };

  const handleUpgrade = () => {
    alert('Redirecionando para pagamento Stripe...');
  };

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' 
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900';

  return (
    <div className={`min-h-screen ${themeClasses} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} isPremium={isPremium} />
        
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-2xl"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={closeCamera}
                  className="px-6 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Capturar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'home' && (
          <>
            <InstallButton darkMode={darkMode} />
            <StatsCard userStats={userStats} darkMode={darkMode} />
            <UploadSection 
              darkMode={darkMode}
              selectedImage={selectedImage}
              handleImageUpload={handleImageUpload}
              analyzeImage={analyzeImage}
              analyzing={analyzing}
              usageCount={usageCount}
              isPremium={isPremium}
              openCamera={openCamera}
            />
            <WorkoutSection 
              darkMode={darkMode}
              workoutMinutes={workoutMinutes}
              setWorkoutMinutes={setWorkoutMinutes}
              addWorkout={addWorkout}
            />
          </>
        )}

        {currentView === 'result' && (
          <ResultView 
            darkMode={darkMode}
            result={result}
            setCurrentView={setCurrentView}
            setSelectedImage={setSelectedImage}
          />
        )}

        {currentView === 'paywall' && (
          <PaywallView 
            darkMode={darkMode}
            handleUpgrade={handleUpgrade}
            setCurrentView={setCurrentView}
          />
        )}
      </div>
    </div>
  );
}