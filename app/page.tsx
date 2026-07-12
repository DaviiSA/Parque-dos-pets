'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cat, Dog, RefreshCw, Trophy, Heart, Search, Sun, Moon, Key, Map, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import Image from 'next/image';

// Types
type PetType = 'cat' | 'dog';
type TimeOfDay = 'day' | 'night';

interface Pet {
  id: number;
  type: PetType;
  name: string;
  description: string;
  secret?: string;
  discovered: boolean;
  isWorking: boolean;
  unlockLevel: number;
}

interface Adventure {
  id: number;
  title: string;
  description: string;
  secretReveal?: string;
}

const CAT_CONFIGS = [
  { name: 'Karly', desc: 'Gata Preta (Fêmea)', level: 0, secret: 'Ela era uma professora de yoga e ensina os pets a manterem a calma em equipe.' },
  { name: 'Jack', desc: 'Gato Preto (Macho)', level: 0, secret: 'Ex-diretor de teatro, ele organiza as missões como espetáculos, mas morre de inveja do Oliver por causa dos seus concertos.' },
  { name: 'Mila', desc: 'Gata Amarela (Fêmea)', level: 0, secret: 'Era uma botânica famosa; agora ensina os pets a respeitarem a natureza do parque.' },
  { name: 'Milo', desc: 'Gato Amarelo (Macho)', level: 0, secret: 'Antigo geólogo e melhor amigo de Branquelo e Nico. Seu grande dilema de vida é sempre colocar o M antes de P e B.' },
  { name: 'Jones', desc: 'Gato Laranja (Macho)', level: 0, secret: 'Ex-trapezista de circo e antigo Rei do Egito; ele treina a agilidade e coordenação do time.' },
  { name: 'Kit', desc: 'Gato Cinza Listrado', level: 0, secret: 'Ex-detetive e espiã habilidosa; ela ensina apenas o Nico a observar pistas e trabalhar em missões secretas.' },
  { name: 'Alex', desc: 'Gato Cinza Listrado', level: 0, secret: 'Era um astrônomo que agora guia o grupo usando as estrelas do Parque.' },
  { name: 'Jane', desc: 'Gata Laranja (Especial)', level: 6, secret: 'Antiga cartógrafa, ela desenhou o mapa que une todos os caminhos do parque.' },
  { name: 'Susi', desc: 'Gata Siamesa (Especial)', level: 7, secret: 'Era uma diplomata humana; sua missão é garantir a harmonia total entre cães e gatos.' },
  { name: 'Lara', desc: 'Gata Branca de Neve', level: 3, secret: 'Ex-patinadora artística, ela ensina o time a deslizar pelos desafios com elegância.' },
  { name: 'Oliver', desc: 'Gato Siamês Elegante', level: 5, secret: 'Era um maestro de orquestra e faz o time trabalhar em perfeita sintonia.' },
  { name: 'Branquelo', desc: 'Gato Branco (Macho)', level: 0, secret: 'Ex-domador e dragão de primavera. Ele, Milo e Nico são inseparáveis e vivem discutindo por que o M vem antes de P e B.' },
  { name: 'Sky', desc: 'Gata Branca (Fêmea)', level: 0, secret: 'Antiga piloto de aviões de carga; ela ensina o grupo a ter uma visão aérea e estratégica das missões.' },
];

const DOG_CONFIGS = [
  { name: 'Wendy', desc: 'Cadela Marrom com Focinho Branco', level: 0, secret: 'Era uma rainha humana de bom coração; hoje lidera o parque com sabedoria.' },
  { name: 'Nina', desc: 'Pitbull Branca (Fêmea)', level: 0, secret: 'Ex-enfermeira, ela cuida da saúde e do bem-estar de todos os membros do time.' },
  { name: 'Leite', desc: 'Pitbull Branco (Macho)', level: 0, secret: 'Era um psicólogo que ajuda os pets a superarem seus medos em conjunto.' },
  { name: 'Lila', desc: 'Chihuahua (Fêmea)', level: 0, secret: 'Ex-bibliotecária, ela guarda o conhecimento ancestral de como os pets devem cooperar.' },
  { name: 'Pet', desc: 'Chihuahua (Macho)', level: 0, secret: 'Era um maratonista que incentiva o grupo a nunca desistir das missões longas.' },
  { name: 'Kookee', desc: 'Poodle (Fêmea)', level: 0, secret: 'Ex-agente secreta, ela treina o time em missões de infiltração silenciosa.' },
  { name: 'Francisco', desc: 'Poodle (Macho)', level: 0, secret: 'Era um compositor de ópera que cria hinos de união para os pets.' },
  { name: 'Kira', desc: 'Schnauzer (Fêmea)', level: 0, secret: 'Antiga nadadora olímpica, ela coordena os resgates aquáticos em equipe.' },
  { name: 'Nico', desc: 'Schnauzer (Macho)', level: 0, secret: 'Ex-coreógrafo e melhor amigo de Milo e Branquelo. Ele tenta criar passos de dança que ajudem o time a decorar a regra do M antes de P e B.' },
  { name: 'Willi', desc: 'Cachorro Marrom com Focinho Amarelado', level: 8, secret: 'Ex-arqueólogo que descobriu que o segredo do parque é o trabalho em equipe.' },
  { name: 'Bidu', desc: 'Golden Retriever Alegre', level: 6, secret: 'Era um paleontólogo que ensina que o futuro do parque depende das raízes do passado.' },
  { name: 'Pipoca', desc: 'Beagle Aventureiro', level: 7, secret: 'Ex-guia de expedições que garante que nenhum pet se perca no caminho.' },
];

const ADVENTURES: Adventure[] = [
  { id: 1, title: 'O Sumiço da Bolinha', description: 'Ajude a recuperar a bolinha favorita no lago.' },
  { id: 2, title: 'Festa no Quintal', description: 'Prepare o terreno para o grande churrasco pet.' },
  { id: 3, title: 'Mistério da Lua', description: 'Investigue luzes estranhas no parque à noite.' },
  { id: 4, title: 'Resgate no Celeiro', description: 'Um filhote se perdeu entre os fardos de feno.' },
  { id: 5, title: 'Piquenique Real', description: 'Proteja os sanduíches das formigas gigantes.' },
  { id: 6, title: 'Corrida das Sombras', description: 'Jane revela que adora correr sob as estrelas!' },
  { id: 7, title: 'O Tesouro Enterrado', description: 'Susi encontrou um medalhão antigo no jardim.' },
  { id: 8, title: 'Show de Talentos', description: 'Willi mostra que seu focinho brilha no escuro!' },
  { id: 9, title: 'Acampamento Selvagem', description: 'Passe a noite sob as estrelas na colina.' },
  { id: 10, title: 'Grande Inauguração', description: 'Abra as portas do novo santuário pet.' },
  { id: 11, title: 'O Código de Karly', description: 'Descubra as mensagens secretas que Karly vê na noite.', secretReveal: 'Karly revela que os gatos pretos são guardiões da sorte!' },
  { id: 12, title: 'O Plano de Jack', description: 'Jack precisa de ajuda para organizar suas chaves.', secretReveal: 'Jack admite que guarda chaves para abrir latas de sachê infinitas.' },
  { id: 13, title: 'O Jardim da Mila', description: 'Ajude Mila a plantar flores que atraem borboletas mágicas.' },
  { id: 14, title: 'O Baú de Milo', description: 'Encontre o esconderijo das pedras brilhantes de Milo.' },
  { id: 15, title: 'Circo do Jones', description: 'Monte o picadeiro para o show de malabarismo do Jones.' },
  { id: 16, title: 'O Portal de Willi', description: 'Willi precisa de energia para abrir o portal dimensional.', secretReveal: 'O portal leva a um mundo onde chovem petiscos!' },
  { id: 17, title: 'União Suprema', description: 'Todos os 25 pets celebram a grande amizade eterna.', secretReveal: 'O maior segredo é que o amor dos humanos é o que lhes dá poderes!' },
];

const createInitialPets = (shuffle = false): Pet[] => {
  const newPets: Pet[] = [];
  CAT_CONFIGS.forEach((config, i) => {
    newPets.push({ id: i, type: 'cat', name: config.name, description: config.desc, secret: config.secret, discovered: false, isWorking: false, unlockLevel: config.level });
  });
  DOG_CONFIGS.forEach((config, i) => {
    newPets.push({ id: i + 100, type: 'dog', name: config.name, description: config.desc, secret: config.secret, discovered: false, isWorking: false, unlockLevel: config.level });
  });
  return shuffle ? newPets.sort(() => Math.random() - 0.5) : newPets;
};

export default function PetParkGame() {
  const [pets, setPets] = useState<Pet[]>(() => createInitialPets(false));
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [lastDiscovered, setLastDiscovered] = useState<Pet | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [keys, setKeys] = useState(0);
  const [adventureProgress, setAdventureProgress] = useState(0); 
  const [mounted, setMounted] = useState(false);
  const [activeMission, setActiveMission] = useState<boolean>(false);
  const [missionItemFound, setMissionItemFound] = useState(false);
  const [missionItemPos, setMissionItemPos] = useState({ top: '50%', left: '50%' });
  const [missionMousePos, setMissionMousePos] = useState({ x: 200, y: 200 }); // Começa mais ao centro
  const [decoyPositions, setDecoyPositions] = useState<{top: string, left: string, rotate: string, icon: string, duration: number}[]>([]);
  const [obstaclePositions, setObstaclePositions] = useState<{top: string, left: string, icon: string, duration: number, xMove: number, yDuration: number}[]>([]);
  const [mazeWalls, setMazeWalls] = useState<{top: string, left: string, type: 'h' | 'v'}[]>([]);
  
  const [grassPositions, setGrassPositions] = useState<{top: string, left: string, rotate: string}[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setPets(createInitialPets(true));
      setGrassPositions([...Array(20)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        rotate: `${Math.random() * 360}deg`
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const initGame = () => {
    setPets(createInitialPets(true));
    setGameState('playing');
    setLastDiscovered(null);
    setKeys(0);
    setAdventureProgress(0);
  };

  const handleDiscover = (id: number) => {
    if (gameState === 'won') return;

    setPets(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, discovered: true } : p);
      const discoveredPet = updated.find(p => p.id === id);
      if (discoveredPet) {
        setLastDiscovered(discoveredPet);
        setKeys(k => k + 1);
      }
      return updated;
    });
  };

  const petsRef = useRef(pets);
  useEffect(() => {
    petsRef.current = pets;
  }, [pets]);

  const togglePetWork = (id: number) => {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;
    
    const newIsWorking = !pet.isWorking;
    
    setPets(current => current.map(p => 
      p.id === id ? { ...p, isWorking: newIsWorking } : p
    ));

    // Feedback imediato ao ativar
    if (newIsWorking) {
      setKeys(prev => prev + 1);
      confetti({
        particleCount: 5,
        spread: 20,
        origin: { y: 0.8 },
        colors: ['#F1C40F']
      });
    }
  };

  const workAll = () => {
    const discoveredCount = pets.filter(p => p.discovered).length;
    setKeys(prev => prev + discoveredCount);
    setPets(current => current.map(p => 
      p.discovered ? { ...p, isWorking: true } : p
    ));
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const stopAll = () => {
    setPets(current => current.map(p => ({ ...p, isWorking: false })));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const workingPets = petsRef.current.filter(p => p.isWorking);
      if (workingPets.length > 0) {
        // Bônus de Mentoria: Pets que já foram humanos ensinam trabalho em equipe
        const teamBonus = Math.floor(workingPets.length / 1.5); 
        setKeys(prev => prev + workingPets.length + teamBonus);
        
        if (workingPets.length >= 5) {
          confetti({
            particleCount: 15,
            spread: 40,
            origin: { y: 0.9 },
            colors: ['#F1C40F', '#F39C12']
          });
        }
      }
    }, 2000); // Mais rápido: 2 segundos
    return () => clearInterval(interval);
  }, []);

  const MISSION_ITEMS: Record<number, string> = {
    1: '🎾', 2: '🍖', 3: '🌙', 4: '🐥', 5: '🥪', 6: '👟', 
    7: '💎', 8: '🎤', 9: '⛺', 10: '🎀', 11: '📜', 12: '🔑', 
    13: '🦋', 14: '📦', 15: '🎩', 16: '🌀', 17: '💝'
  };

  const unlockAdventure = () => {
    if (activeMission) return; 
    if (keys >= 50 && adventureProgress < 17) {
      setKeys(k => k - 50);
      setMissionItemFound(false);
      setMissionItemPos({
        top: `${20 + Math.random() * 60}%`,
        left: `${10 + Math.random() * 80}%`
      });
      setDecoyPositions([...Array(20)].map(() => ({
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`,
        rotate: `${Math.random() * 360}deg`,
        icon: ['🌿', '🍂', '🪨', '🍄', '🪵'][Math.floor(Math.random() * 5)],
        duration: 2 + Math.random() * 3
      })));
      setObstaclePositions([...Array(12)].map(() => ({
        top: `${Math.random() * 85}%`,
        left: `${-20 + Math.random() * 140}%`,
        icon: ['🌳', '🌲', '🎋', '🌵', '🧱'][Math.floor(Math.random() * 5)],
        duration: 4 + Math.random() * 6,
        xMove: Math.random() > 0.5 ? 120 : -120,
        yDuration: 2 + Math.random() * 2
      })));
      setMazeWalls([...Array(10)].map(() => ({
        top: `${10 + Math.random() * 70}%`,
        left: `${10 + Math.random() * 70}%`,
        type: Math.random() > 0.5 ? 'h' : 'v'
      })));
      setActiveMission(true);
      
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#F39C12']
      });
    }
  };

  const finishMission = () => {
    setActiveMission(false);
    setMissionItemFound(false); // Reinicia para a próxima
    const nextLevel = adventureProgress + 1;
    setAdventureProgress(nextLevel);
    
    if (nextLevel === 17) {
      setGameState('won');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    } else {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#4ade80', '#22c55e']
      });
    }
  };

  const availablePets = pets.filter(p => p.unlockLevel <= adventureProgress);
  const catsFound = availablePets.filter(p => p.type === 'cat' && p.discovered).length;
  const totalCats = availablePets.filter(p => p.type === 'cat').length;
  const dogsFound = availablePets.filter(p => p.type === 'dog' && p.discovered).length;
  const totalDogs = availablePets.filter(p => p.type === 'dog').length;

  const isNight = timeOfDay === 'night';
  const bgColor = isNight ? 'bg-[#1A1A2E]' : 'bg-[#FDFCF0]';
  const textColor = isNight ? 'text-gray-100' : 'text-[#2D3436]';
  const parkColor = isNight ? 'bg-[#2C3E50]' : 'bg-[#E1F2D1]';
  const parkBorder = isNight ? 'border-[#34495E]' : 'border-[#C8E6A5]';

  return (
    <main className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-1000 p-4 md:p-8 flex flex-col items-center relative overflow-hidden`}>
      {/* Decorative Scenario Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Trees */}
        <div className={`absolute top-20 -left-10 text-6xl transition-opacity duration-1000 ${isNight ? 'opacity-20' : 'opacity-40'}`}>🌳</div>
        <div className={`absolute top-40 -right-10 text-7xl transition-opacity duration-1000 ${isNight ? 'opacity-20' : 'opacity-40'}`}>🌳</div>
        <div className={`absolute bottom-20 -left-5 text-5xl transition-opacity duration-1000 ${isNight ? 'opacity-10' : 'opacity-30'}`}>🌲</div>
        
        {/* Lake */}
        <div className={`absolute -bottom-20 right-0 w-64 h-64 rounded-full transition-colors duration-1000 ${isNight ? 'bg-blue-900/20' : 'bg-blue-200/40'} blur-2xl`}></div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-40">🦆</div>

        {/* Flowers/Bushes */}
        <div className="absolute top-1/4 right-20 text-2xl opacity-30">🌸</div>
        <div className="absolute bottom-1/4 left-20 text-2xl opacity-30">🌻</div>
      </div>

      {/* Header */}
      <header className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-6 relative z-10">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
            <h1 className={`text-4xl md:text-5xl font-display font-bold ${isNight ? 'text-indigo-400' : 'text-[#E67E22]'} tracking-tight`}>
              Parque dos Pets
            </h1>
            <button 
              onClick={() => setTimeOfDay(t => t === 'day' ? 'night' : 'day')}
              className={`p-3 rounded-full shadow-lg ${isNight ? 'bg-indigo-900 text-yellow-400' : 'bg-orange-100 text-orange-600'} hover:scale-110 transition-all`}
            >
              {isNight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
          </div>
          <p className={`text-lg ${isNight ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
            Reúna a equipe para desbloquear 17 grandes aventuras!
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 items-center bg-white/10 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/20">
          <div className="flex flex-col items-center px-4 border-r border-white/10">
            <span className="text-[10px] uppercase font-bold opacity-60">Chaves</span>
            <div className="flex items-center gap-2">
              <Key className={`w-5 h-5 ${keys >= 50 ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`} />
              <span className="text-2xl font-display font-bold text-yellow-500">{keys}</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 border-r border-white/10">
            <span className="text-[10px] uppercase font-bold opacity-60">Gatos</span>
            <div className="flex items-center gap-1">
              <Cat className="w-5 h-5 text-orange-400" />
              <span className="text-2xl font-display font-bold">{catsFound}/{totalCats}</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-4">
            <span className="text-[10px] uppercase font-bold opacity-60">Cães</span>
            <div className="flex items-center gap-1">
              <Dog className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-display font-bold">{dogsFound}/{totalDogs}</span>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 border-l border-white/10">
            <span className="text-[10px] uppercase font-bold opacity-60">Teamwork</span>
            <div className="flex items-center gap-1 group relative cursor-help">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-display font-bold text-green-500">+{Math.floor(pets.filter(p => p.isWorking).length / 1.5)}</span>
              <div className="absolute top-full mt-2 right-0 w-48 bg-black/95 text-[10px] p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-white border border-white/10 shadow-2xl leading-relaxed">
                <span className="text-green-400 font-bold block mb-1 uppercase tracking-widest text-[8px]">Mentoria Humana</span>
                Nossos personagens (ex-humanos) estão ensinando os pets a trabalharem em equipe! Cada dupla aumenta a produção de chaves.
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Adventures */}
        <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Map className="w-5 h-5 text-yellow-500" />
            Jornada do Parque ({adventureProgress}/17)
          </h2>
          <div className="bg-white/5 rounded-3xl p-4 border border-white/10 h-[600px] overflow-y-auto space-y-3 custom-scrollbar">
            {ADVENTURES.map((adv, idx) => {
              const isCurrent = idx === adventureProgress;
              const isCompleted = idx < adventureProgress;
              return (
                <div 
                  key={adv.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted ? 'bg-green-500/10 border-green-500/30' : 
                    isCurrent ? 'bg-yellow-500/10 border-yellow-500/50 scale-105 shadow-lg' : 
                    'bg-white/5 border-white/10 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase opacity-50">Missão {adv.id}</span>
                    {isCompleted && <div className="text-green-500 text-xs font-bold">COMPLETA</div>}
                  </div>
                  <h3 className="font-bold mb-1">{adv.title}</h3>
                  <p className="text-xs opacity-70 leading-tight mb-2">{adv.description}</p>
                  
                  {isCompleted && adv.secretReveal && (
                    <div className="mt-2 p-2 bg-indigo-500/20 rounded-lg text-[10px] font-medium text-indigo-300 italic border border-indigo-500/30">
                      ✨ Segredo: {adv.secretReveal}
                    </div>
                  )}

                  {isCurrent && (
                    <button
                      onClick={unlockAdventure}
                      disabled={keys < 50 || activeMission}
                      className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                        activeMission ? 'bg-zinc-800 text-zinc-500' :
                        keys >= 50 ? 'bg-yellow-500 text-black hover:scale-105 animate-bounce' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {activeMission ? 'MISSÃO EM CURSO...' : keys >= 50 ? 'DESBLOQUEAR AGORA! (50 CHAVES)' : `FALTAM ${50 - keys} CHAVES`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Game Grid */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          {/* Active Mission Banner */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Map className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Objetivo Atual:</span>
                <h3 className="font-display font-bold text-lg">{ADVENTURES[adventureProgress]?.title || 'Todas as Missões Concluídas!'}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {keys >= 50 && adventureProgress < 17 && !activeMission && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={unlockAdventure}
                  className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-bounce flex items-center gap-2 border-2 border-white/20"
                >
                  <Trophy className="w-4 h-4" />
                  INICIAR MISSÃO
                </motion.button>
              )}
              {activeMission && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setActiveMission(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 animate-pulse border-2 border-white/20 shadow-lg"
                >
                  <Map className="w-4 h-4" />
                  MISSÃO ATIVA
                </motion.button>
              )}
              
              <div className="text-right">
                <div className="text-xs font-bold opacity-60 mb-1">Progresso</div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-500" 
                      style={{ width: `${(keys / 50) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold">{keys}/50 🔑</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${parkColor} ${parkBorder} p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-8 transition-colors duration-1000 min-h-[400px]`}>
            {/* Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              {mounted && grassPositions.map((pos, i) => (
                <div key={i} className={`absolute text-lg ${isNight ? 'text-indigo-300' : 'text-green-700'}`} style={{
                  top: pos.top,
                  left: pos.left,
                  transform: `rotate(${pos.rotate})`
                }}>
                  {isNight ? '✨' : '🍃'}
                </div>
              ))}
            </div>

            {/* Mission Decorative Element */}
            {mounted && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-8xl blur-[1px] transition-all duration-1000">
                {adventureProgress === 0 && '🧺'}
                {adventureProgress === 1 && '🎾'}
                {adventureProgress === 2 && '🍰'}
                {adventureProgress === 3 && '🌙'}
                {adventureProgress === 4 && '🏰'}
                {adventureProgress === 5 && '🌊'}
                {adventureProgress === 6 && '👻'}
                {adventureProgress === 7 && '💎'}
                {adventureProgress === 8 && '🛸'}
                {adventureProgress === 9 && '🎨'}
                {adventureProgress >= 10 && '✨'}
              </div>
            )}

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
              {mounted && availablePets.map((pet) => (
                <motion.button
                  key={pet.id}
                  whileHover={{ scale: pet.discovered ? 1 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !pet.discovered && handleDiscover(pet.id)}
                  className={`
                    relative aspect-square rounded-2xl flex items-center justify-center text-3xl
                    transition-all duration-500
                    ${pet.discovered 
                      ? (isNight ? 'bg-indigo-900/50 border-indigo-400/30' : (pet.type === 'cat' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200')) 
                      : (isNight ? 'bg-[#21213D] hover:bg-[#2D2D50] border-[#16162E]' : 'bg-[#8BC34A] hover:bg-[#9CCC65] border-[#7CB342]')}
                    border-b-4 active:border-b-0 active:translate-y-[2px]
                    cursor-pointer shadow-lg
                  `}
                >
                  <AnimatePresence mode="wait">
                    {pet.discovered ? (
                      <motion.div
                        key="pet"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex flex-col items-center"
                      >
                        {pet.type === 'cat' ? (
                          <Cat className={`w-8 h-8 ${isNight ? 'text-indigo-300' : 'text-orange-500'}`} />
                        ) : (
                          <Dog className={`w-8 h-8 ${isNight ? 'text-indigo-300' : 'text-blue-500'}`} />
                        )}
                        <span className={`text-[8px] font-bold mt-1 uppercase tracking-tighter ${isNight ? 'text-indigo-200' : 'text-gray-500'}`}>
                          {pet.name}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="grass"
                        exit={{ scale: 1.5, opacity: 0 }}
                      >
                        <Search className={`w-6 h-6 ${isNight ? 'text-indigo-800' : 'text-[#AED581]'}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                Sua Equipe
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={workAll}
                  className="text-[10px] bg-green-500/20 hover:bg-green-500/40 text-green-400 px-2 py-1 rounded-lg border border-green-500/30 font-bold transition-all"
                >
                  ATIVAR EQUIPE
                </button>
                <button 
                  onClick={stopAll}
                  className="text-[10px] bg-red-500/20 hover:bg-red-500/40 text-red-400 px-2 py-1 rounded-lg border border-red-500/30 font-bold transition-all"
                >
                  PAUSAR TUDO
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {pets.filter(p => p.discovered).length === 0 && (
                <p className="text-sm opacity-40 italic">Encontre pets na grama para eles começarem a buscar chaves!</p>
              )}
              {pets.filter(p => p.discovered).map(pet => (
                <motion.button
                  key={`work-${pet.id}`}
                  onClick={() => togglePetWork(pet.id)}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all relative
                    ${pet.isWorking ? 'bg-yellow-500/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-white/10 border-white/20 hover:bg-white/30'}
                    ${!pet.isWorking && keys < 50 ? 'animate-pulse' : ''}
                  `}
                >
                  <div className="relative">
                    {pet.type === 'cat' ? <Cat className="w-5 h-5" /> : <Dog className="w-5 h-5" />}
                    {pet.isWorking && (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute -top-1 -right-1"
                      >
                        <RefreshCw className="w-3 h-3 text-yellow-500" />
                      </motion.div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold leading-none">{pet.name}</div>
                    <div className="text-[8px] opacity-50 mt-1 uppercase tracking-tighter">
                      {pet.isWorking ? 'Buscando...' : 'Descansando'}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-12 max-w-4xl w-full bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="flex-1">
          <h3 className="text-2xl font-display font-bold mb-3 flex items-center gap-3">
            {lastDiscovered ? (
              <>
                <Trophy className="w-6 h-6 text-yellow-500" />
                {lastDiscovered.name} e seu segredo...
              </>
            ) : (
              'Guia do Aventureiro'
            )}
          </h3>
          <div className="space-y-4">
            {!lastDiscovered && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2">
                  <Search className="w-5 h-5 text-green-400" />
                  1. Procure pets na grama
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  2. Ative a Equipe para bônus de chaves
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2">
                  <Map className="w-5 h-5 text-blue-400" />
                  3. Use o botão &quot;Iniciar Missão&quot; no topo
                </div>
              </div>
            )}
            <p className="text-sm opacity-60 leading-relaxed">
              {lastDiscovered 
                ? `${lastDiscovered.description}.` 
                : 'Trabalho em Equipe: Ative vários pets juntos para ganhar chaves bônus! Cada missão requer 50 chaves para ser revelada.'}
            </p>
            {lastDiscovered?.secret && (
              <p className="text-sm text-yellow-500/80 font-medium italic bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                🤫 Segredo: {lastDiscovered.secret}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={initGame}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10"
        >
          Recomeçar
        </button>
      </div>

      {/* Gallery Section */}
      <div className="mt-20 max-w-5xl w-full relative z-10">
        <h2 className="text-3xl font-display font-bold mb-8 text-center">Álbum de Recordações</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cats Gallery */}
          <div className="bg-white/5 p-8 rounded-[3rem] shadow-xl border border-orange-500/20 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Os 7 Felinos ({pets.filter(p => p.type === 'cat' && p.discovered).length}/7)
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {pets.filter(p => p.type === 'cat').map(pet => (
                <div key={`gal-cat-${pet.id}`} className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                    pet.discovered ? 'bg-orange-500/20 border border-orange-500/40' : 'bg-gray-800/50 border border-white/5 grayscale opacity-20'
                  }`}>
                    {pet.discovered ? '🐱' : '?'}
                  </div>
                  <span className={`text-[10px] font-bold truncate w-full text-center ${pet.discovered ? 'text-white' : 'text-white/20'}`}>
                    {pet.discovered ? pet.name : '??'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dogs Gallery */}
          <div className="bg-white/5 p-8 rounded-[3rem] shadow-xl border border-blue-500/20 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6 text-center flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Os 9 Caninos ({pets.filter(p => p.type === 'dog' && p.discovered).length}/9)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {pets.filter(p => p.type === 'dog').map(pet => (
                <div key={`gal-dog-${pet.id}`} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 ${
                    pet.discovered ? 'bg-blue-500/20 border border-blue-500/40' : 'bg-gray-800/50 border border-white/5 grayscale opacity-20'
                  }`}>
                    {pet.discovered ? '🐶' : '?'}
                  </div>
                  <span className={`text-[10px] font-bold truncate w-full text-center ${pet.discovered ? 'text-white' : 'text-white/20'}`}>
                    {pet.discovered ? pet.name : '??'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Win Modal & Mission Overlay */}
      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border border-yellow-500/30 rounded-[3rem] p-12 max-w-xl w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Lendas do Parque!
              </h2>
              <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                Você completou as 17 aventuras lendárias e descobriu todos os segredos dos pets. O Parque agora é um santuário de magia eterna!
              </p>
              <button
                onClick={initGame}
                className="w-full py-5 bg-yellow-500 text-black rounded-3xl font-bold text-xl hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/30"
              >
                Voltar ao Início
              </button>
            </motion.div>
          </motion.div>
        )}

        {activeMission && (
          <motion.div 
            key={`mission-overlay-${adventureProgress}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-4xl w-full h-[90vh] bg-zinc-900 border border-white/10 rounded-[3rem] relative overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Mission Header */}
              <div className="p-8 border-b border-white/5 bg-black/20 text-center relative z-20">
                <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-yellow-500 mb-2">Missão Ativa</span>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  {ADVENTURES[adventureProgress]?.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {missionItemFound 
                    ? "¡Parabéns! Você encontrou o item. Agora conclua a missão!" 
                    : `Procure o item "${MISSION_ITEMS[adventureProgress + 1]}" escondido no cenário abaixo.`}
                </p>
              </div>

              {/* Scenery Area */}
              <div 
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMissionMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }}
                onTouchMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touch = e.touches[0];
                  if (touch) {
                    setMissionMousePos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
                  }
                }}
                className={`flex-1 relative overflow-hidden transition-colors duration-1000 cursor-crosshair ${isNight ? 'bg-indigo-950/40' : 'bg-green-900/30'}`}
              >
                {/* Search Grid Background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                
                {/* Labyrinth Walls */}
                {mazeWalls.map((wall, i) => (
                  <div 
                    key={`wall-${i}`}
                    className="absolute bg-zinc-800/80 border border-white/10 shadow-inner z-10"
                    style={{
                      top: wall.top,
                      left: wall.left,
                      width: wall.type === 'h' ? '150px' : '25px',
                      height: wall.type === 'h' ? '25px' : '150px',
                      borderRadius: '12px'
                    }}
                  />
                ))}

                {/* Static Maze Elements (Decoys) */}
                {decoyPositions.map((pos, i) => (
                  <motion.div 
                    key={`decoy-${i}`} 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 0.3, 
                      scale: 1.2,
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      delay: i * 0.01,
                      rotate: { repeat: Infinity, duration: pos.duration, ease: "easeInOut" }
                    }}
                    className="absolute pointer-events-none select-none text-4xl z-20" 
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: `rotate(${pos.rotate})`
                    }}
                  >
                    {pos.icon}
                  </motion.div>
                ))}

                {/* Moving Obstacles (The real challenge) */}
                {obstaclePositions.map((obs, i) => (
                  <motion.div
                    key={`obs-${i}`}
                    initial={{ x: obs.xMove > 0 ? -200 : 1200, opacity: 0 }}
                    animate={{ 
                      x: obs.xMove > 0 ? 1200 : -200,
                      opacity: 1,
                      y: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      x: { repeat: Infinity, duration: obs.duration, ease: "linear" },
                      y: { repeat: Infinity, duration: obs.yDuration, ease: "easeInOut" },
                      scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                      opacity: { duration: 1 }
                    }}
                    className="absolute pointer-events-none select-none text-9xl z-40 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    style={{ top: obs.top, left: '0' }}
                  >
                    {obs.icon}
                  </motion.div>
                ))}

                {/* Searching Pets Following Cursor */}
                {['🐈', '🐕', '🦜'].map((pet, i) => (
                  <motion.div
                    key={`pet-search-${i}`}
                    animate={{ 
                      x: missionMousePos.x + (i * 30) - 45,
                      y: missionMousePos.y + (i * 20) - 45,
                      rotate: [0, 15, -15, 0]
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 50,
                      damping: 10,
                      rotate: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    }}
                    className="absolute text-6xl z-50 pointer-events-none filter drop-shadow-2xl"
                    style={{ left: 0, top: 0 }}
                  >
                    {pet}
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-yellow-400/30 rounded-full blur-2xl -z-10"
                    />
                  </motion.div>
                ))}

                {/* The Hidden Item */}
                {!missionItemFound && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotate: [0, 15, -15, 0] }}
                    transition={{ 
                      opacity: { duration: 0.5 },
                      rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }}
                    onClick={() => {
                      setMissionItemFound(true);
                      confetti({ 
                        particleCount: 60, 
                        spread: 80, 
                        origin: { y: 0.6 },
                        colors: ['#4ade80', '#fbbf24']
                      });
                    }}
                    className="absolute p-6 text-6xl hover:scale-150 transition-transform cursor-pointer z-30 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-white/5 rounded-full backdrop-blur-sm border border-white/10"
                    style={{
                      top: missionItemPos.top,
                      left: missionItemPos.left,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {MISSION_ITEMS[adventureProgress + 1]}
                  </motion.button>
                )}

                {/* Success Indicator */}
                {missionItemFound && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] flex flex-col items-center"
                  >
                    <div className="relative">
                      <div className="text-[12rem] drop-shadow-[0_0_50px_rgba(34,197,94,0.8)]">
                        {MISSION_ITEMS[adventureProgress + 1]}
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-green-500 rounded-full blur-[80px] -z-10"
                      />
                    </div>
                    <div className="bg-green-500 text-white px-10 py-4 rounded-3xl font-bold text-2xl animate-bounce shadow-2xl border-4 border-white/20 mt-8">
                      ITEM ENCONTRADO!
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-col gap-4 items-center relative z-20">
                {missionItemFound ? (
                  <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={finishMission}
                    className="w-full max-w-md bg-green-500 hover:bg-green-400 text-white px-10 py-6 rounded-[2rem] font-bold text-2xl transition-all shadow-[0_20px_50px_rgba(34,197,94,0.4)] flex items-center justify-center gap-4 hover:scale-105 active:scale-95"
                  >
                    <Trophy className="w-8 h-8" />
                    CONCLUIR MISSÃO
                  </motion.button>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-2xl border border-white/10">
                      <div className="w-6 h-6 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                      <p className="text-sm uppercase font-bold tracking-[0.4em] text-yellow-500/80">Rastreando sinal do item...</p>
                    </div>
                    <p className="text-xs text-white/30 uppercase tracking-widest text-center max-w-xs">
                      Vasculhe o parque tocando nos itens. A {ADVENTURES[adventureProgress]?.title} depende de você!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 py-10 border-t border-white/5 w-full text-center opacity-30 text-xs relative z-10">
        <p>© 2026 O Parque dos Pets • 17 Aventuras • Ciclo Infinito • Segredos Revelados</p>
      </footer>
    </main>
  );
}
