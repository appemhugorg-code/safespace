import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Game {
    id: number;
    name: string;
    slug: string;
    description: string;
    type: string;
    config: any;
    difficulty: string;
    estimated_duration: number;
}

interface Progress {
    id: number;
    completed: boolean;
    score: number;
    game_data: any;
}

interface Props {
    game: Game;
    progress: Progress;
}

export default function ShowGame({ game, progress }: Props) {
    const [gameState, setGameState] = useState('ready'); // ready, playing, paused, completed
    const [score, setScore] = useState(progress.score || 0);
    const [gameData, setGameData] = useState(progress.game_data || {});
    const [progressSaved, setProgressSaved] = useState(false);

    const startGame = () => {
        setGameState('playing');
    };

    const pauseGame = () => {
        setGameState('paused');
    };

    const resetGame = () => {
        setGameState('ready');
        setScore(0);
        setGameData({});
    };

    const completeGame = (finalScore: number, finalData: any = {}) => {
        setGameState('completed');
        setScore(finalScore);
        setGameData(finalData);

        // Update progress on server
        router.post(`/games/${game.id}/progress`, {
            completed: true,
            score: finalScore,
            session_data: finalData,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProgressSaved(true);
            },
            onError: (errors) => {
                console.error('Failed to update progress:', errors);
            }
        });
    };

    const renderGame = () => {
        switch (game.type) {
            case 'breathing':
                return <BreathingGame
                    config={game.config}
                    gameState={gameState}
                    onComplete={completeGame}
                    onStateChange={setGameState}
                />;
            case 'mood-matching':
                return <MoodMatchingGame
                    config={game.config}
                    gameState={gameState}
                    onComplete={completeGame}
                    onStateChange={setGameState}
                />;
            case 'affirmations':
                return <AffirmationsGame
                    config={game.config}
                    gameState={gameState}
                    onComplete={completeGame}
                    onStateChange={setGameState}
                />;
            default:
                return <div className="text-center py-8">Game type not implemented yet!</div>;
        }
    };

    return (
        <AppLayout>
            <Head title={game.name} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <Link href="/games">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Games
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{game.name}</CardTitle>
                            <p className="text-gray-600">{game.description}</p>
                        </CardHeader>
                        <CardContent>
                            {/* Game Controls */}
                            <div className="flex justify-center gap-4 mb-6">
                                {gameState === 'ready' && (
                                    <Button onClick={startGame} size="lg">
                                        <Play className="w-5 h-5 mr-2" />
                                        Start Game
                                    </Button>
                                )}
                                {gameState === 'playing' && (
                                    <Button onClick={pauseGame} variant="outline" size="lg">
                                        <Pause className="w-5 h-5 mr-2" />
                                        Pause
                                    </Button>
                                )}
                                {(gameState === 'paused' || gameState === 'completed') && (
                                    <>
                                        <Button onClick={startGame} size="lg">
                                            <Play className="w-5 h-5 mr-2" />
                                            {gameState === 'paused' ? 'Resume' : 'Play Again'}
                                        </Button>
                                        <Button onClick={resetGame} variant="outline" size="lg">
                                            <RotateCcw className="w-5 h-5 mr-2" />
                                            Reset
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Game Area */}
                            <div className="min-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                                {renderGame()}
                            </div>

                            {/* Score Display */}
                            {gameState === 'completed' && (
                                <div className="text-center mt-6 p-4 bg-green-50 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                                        🎉 Great Job!
                                    </h3>
                                    <p className="text-green-700">
                                        You completed {game.name}! Score: {score}
                                    </p>
                                    {progressSaved && (
                                        <p className="text-sm text-green-600 mt-2">
                                            ✅ Progress saved successfully!
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// Breathing Game Component
function BreathingGame({ config, gameState, onComplete, onStateChange }: any) {
    const [cycle, setCycle] = useState(0);
    const [phase, setPhase] = useState('breathe-in'); // breathe-in, hold, breathe-out
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            setTimer(prev => {
                const newTimer = prev + 1;
                const breathInDuration = config.breath_in_duration || 4;
                const breathOutDuration = config.breath_out_duration || 6;
                const totalCycleDuration = breathInDuration + breathOutDuration;

                if (newTimer >= totalCycleDuration) {
                    const newCycle = cycle + 1;
                    setCycle(newCycle);

                    if (newCycle >= (config.cycles || 5)) {
                        onComplete(100, { cycles_completed: newCycle });
                        return 0;
                    }
                    return 0;
                } else if (newTimer <= breathInDuration) {
                    setPhase('breathe-in');
                } else {
                    setPhase('breathe-out');
                }

                return newTimer;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, cycle, config, onComplete]);

    const bubbleScale = phase === 'breathe-in'
        ? 'scale-150'
        : 'scale-75';

    return (
        <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
                Breathing Exercise - Cycle {cycle + 1} of {config.cycles || 5}
            </h3>

            <div className="flex justify-center mb-6">
                <div className={`w-32 h-32 bg-blue-400 rounded-full transition-transform duration-1000 ${bubbleScale} flex items-center justify-center`}>
                    <span className="text-white font-semibold">
                        {phase === 'breathe-in' ? 'Breathe In' : 'Breathe Out'}
                    </span>
                </div>
            </div>

            <p className="text-lg text-gray-700">
                {phase === 'breathe-in'
                    ? 'Slowly breathe in through your nose...'
                    : 'Gently breathe out through your mouth...'
                }
            </p>
        </div>
    );
}

// Mood Matching Game Component
function MoodMatchingGame({ config, gameState, onComplete }: any) {
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [currentEmotion, setCurrentEmotion] = useState('');
    const [options, setOptions] = useState<string[]>([]);

    const emotions = config.emotions || ['happy', 'sad', 'angry', 'calm', 'excited', 'scared'];
    const emotionEmojis: { [key: string]: string } = {
        happy: '😊',
        sad: '😢',
        angry: '😠',
        calm: '😌',
        excited: '🤩',
        scared: '😨',
        worried: '😟'
    };

    useEffect(() => {
        if (gameState === 'playing' && currentRound === 0 && !currentEmotion) {
            startNewRound();
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === 'playing' && currentRound > 0 && currentRound < (config.rounds || config.levels * 2 || 6)) {
            startNewRound();
        }
    }, [currentRound]);

    const startNewRound = () => {
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        setCurrentEmotion(emotion);

        // Create options with correct answer and 2 random wrong answers
        const wrongOptions = emotions.filter(e => e !== emotion);
        const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
        const allOptions = [emotion, ...shuffledWrong].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    };

    const handleAnswer = (selectedEmotion: string) => {
        const isCorrect = selectedEmotion === currentEmotion;
        if (isCorrect) {
            setScore(prev => prev + 10);
        }

        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);

        if (nextRound >= (config.rounds || config.levels * 2 || 6)) {
            onComplete(score + (isCorrect ? 10 : 0), {
                rounds_completed: nextRound,
                final_score: score + (isCorrect ? 10 : 0)
            });
        }
    };

    if (gameState !== 'playing') {
        return (
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Mood Matching Game</h3>
                <p>Match the emotion with its name!</p>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
                Round {currentRound + 1} of {config.rounds || config.levels * 2 || 6}
            </h3>
            <p className="mb-2">Score: {score}</p>

            <div className="text-8xl mb-6">
                {emotionEmojis[currentEmotion] || '😐'}
            </div>

            <p className="text-lg mb-6">What emotion is this?</p>

            <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                {options.map((emotion) => (
                    <Button
                        key={emotion}
                        onClick={() => handleAnswer(emotion)}
                        variant="outline"
                        className="capitalize"
                    >
                        {emotion}
                    </Button>
                ))}
            </div>
        </div>
    );
}

// Affirmations Game Component
function AffirmationsGame({ config, gameState, onComplete }: any) {
    const [currentAffirmation, setCurrentAffirmation] = useState(0);
    const [plantsGrown, setPlantsGrown] = useState(0);

    const affirmations = config.affirmations || [
        'I am brave and strong',
        'I am loved and cared for',
        'I can handle difficult feelings'
    ];

    const plantAffirmation = () => {
        const nextAffirmation = currentAffirmation + 1;
        setCurrentAffirmation(nextAffirmation);
        setPlantsGrown(prev => prev + 1);

        if (nextAffirmation >= affirmations.length) {
            onComplete(plantsGrown * 20, {
                affirmations_planted: plantsGrown + 1,
                garden_completed: true
            });
        }
    };

    if (gameState !== 'playing') {
        return (
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Positive Thoughts Garden</h3>
                <p>Plant positive thoughts and watch your garden grow!</p>
            </div>
        );
    }

    return (
        <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Your Positive Garden</h3>

            <div className="mb-6">
                <div className="flex justify-center gap-2 mb-4">
                    {Array.from({ length: affirmations.length }).map((_, index) => (
                        <div key={index} className="text-4xl">
                            {index < plantsGrown ? '🌸' : '🌱'}
                        </div>
                    ))}
                </div>
            </div>

            {currentAffirmation < affirmations.length && (
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <p className="text-lg font-medium text-gray-800 mb-4">
                        "{affirmations[currentAffirmation]}"
                    </p>
                    <Button onClick={plantAffirmation} size="lg">
                        Plant This Thought 🌱
                    </Button>
                </div>
            )}
        </div>
    );
}
