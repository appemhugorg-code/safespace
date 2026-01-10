import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Trophy, Clock, Star } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Game {
    id: number;
    name: string;
    slug: string;
    description: string;
    type: string;
    difficulty: 'easy' | 'medium' | 'hard';
    estimated_duration: number;
    completed: boolean;
    score: number | null;
    completion_rate: number;
}

interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    earned_at: string;
}

interface Stats {
    total_games: number;
    completed_games: number;
    total_achievements: number;
    total_play_time: number;
}

interface Props {
    games: Game[];
    achievements: Achievement[];
    stats: Stats;
}

const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
};

const typeIcons = {
    breathing: '🫁',
    'mood-matching': '😊',
    affirmations: '🌸',
    mindfulness: '🧘',
    'coping-skills': '⚔️',
};

export default function GamesIndex({ games, achievements, stats }: Props) {
    const completionPercentage = stats.total_games > 0
        ? Math.round((stats.completed_games / stats.total_games) * 100)
        : 0;

    return (
        <AppLayout>
            <Head title="Games" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fun Learning Games</h1>
                        <p className="text-gray-600">
                            Play games to learn about emotions, breathing, and feeling better!
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Games Completed</CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completed_games}</div>
                                <p className="text-xs text-muted-foreground">
                                    out of {stats.total_games} games
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{completionPercentage}%</div>
                                <Progress value={completionPercentage} className="mt-2" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                                <Badge className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_achievements}</div>
                                <p className="text-xs text-muted-foreground">
                                    badges earned
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Play Time</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(stats.total_play_time / 60)}m
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    total minutes
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Achievements */}
                    {achievements.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Your Achievements 🏆</h2>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {achievements.slice(0, 5).map((achievement) => (
                                    <Card key={achievement.id} className="min-w-[200px] bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                                        <CardContent className="p-4 text-center">
                                            <div className="text-3xl mb-2">{achievement.icon}</div>
                                            <h3 className="font-semibold text-sm">{achievement.name}</h3>
                                            <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Games Grid */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Choose a Game to Play</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {games.map((game) => (
                                <Card key={game.id} className={`hover:shadow-lg transition-shadow ${game.completed ? 'bg-green-50 border-green-200' : ''}`}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-3xl">
                                                {typeIcons[game.type as keyof typeof typeIcons] || '🎮'}
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge className={difficultyColors[game.difficulty]}>
                                                    {game.difficulty}
                                                </Badge>
                                                {game.completed && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        ✓ Done
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg">{game.name}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {game.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {game.estimated_duration} min
                                            </span>
                                            {game.score !== null && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="w-4 h-4" />
                                                    Score: {game.score}
                                                </span>
                                            )}
                                        </div>

                                        <Link href={`/games/${game.slug}`}>
                                            <Button className="w-full" variant={game.completed ? "outline" : "default"}>
                                                <Play className="w-4 h-4 mr-2" />
                                                {game.completed ? 'Play Again' : 'Start Game'}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
