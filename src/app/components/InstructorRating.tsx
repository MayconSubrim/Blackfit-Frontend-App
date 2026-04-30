import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { AppHeader } from './AppHeader';

interface Instructor {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  currentRating: number;
  totalReviews: number;
}

const mockInstructors: Instructor[] = [
  { id: 1, name: 'Coach Sarah', specialty: 'Treino de Força', avatar: 'CS', currentRating: 4.8, totalReviews: 124 },
  { id: 2, name: 'Coach Mike', specialty: 'HIIT & Cardio', avatar: 'CM', currentRating: 4.9, totalReviews: 156 },
  { id: 3, name: 'Coach Emma', specialty: 'Yoga & Flexibilidade', avatar: 'CE', currentRating: 4.7, totalReviews: 98 },
  { id: 4, name: 'Coach David', specialty: 'CrossFit', avatar: 'CD', currentRating: 4.6, totalReviews: 87 },
];

export function InstructorRating() {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInstructor || rating === 0) return;

    setSubmitted(true);
    toast.success('Obrigado pelo seu feedback!', {
      description: `Sua avaliação para ${selectedInstructor.name} foi enviada.`,
    });

    // Reset after 2 seconds
    setTimeout(() => {
      setSelectedInstructor(null);
      setRating(0);
      setComment('');
      setSubmitted(false);
    }, 2000);
  };

  const StarRating = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };

    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`${sizeClasses[size]} transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-[#FFD700] text-[#FFD700]'
                  : 'text-gray-500'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-center" theme="dark" />
      
      <AppHeader activePage="rating" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Avalie Seu <span className="text-[#FFD700]">Instrutor</span>
          </h1>
          <p className="text-gray-400">Ajude-nos a melhorar compartilhando seu feedback</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructors List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="text-xl font-bold text-white mb-4">Selecione o Instrutor</h2>
            <div className="space-y-3">
              {mockInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => {
                      setSelectedInstructor(instructor);
                      setRating(0);
                      setComment('');
                      setSubmitted(false);
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedInstructor?.id === instructor.id
                        ? 'bg-[#FFD700]/10 border-[#FFD700] border-2'
                        : 'bg-[#0A0A0A] border-[#333333] hover:border-[#FFD700]'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center font-bold text-black">
                        {instructor.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{instructor.name}</h3>
                        <p className="text-xs text-gray-400">{instructor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      <span className="text-sm font-semibold text-white">
                        {instructor.currentRating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({instructor.totalReviews} avaliações)
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rating Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedInstructor ? (
              <Card className="bg-[#0A0A0A] border-[#333333] p-8">
                {submitted ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FFD700] rounded-full mb-6">
                      <CheckCircle2 className="w-12 h-12 text-black" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Obrigado!</h2>
                    <p className="text-gray-400">Seu feedback foi enviado com sucesso.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Instructor Info */}
                    <div className="flex items-center gap-4 pb-6 border-b border-[#333333]">
                      <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-2xl font-bold text-black">
                        {selectedInstructor.avatar}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {selectedInstructor.name}
                        </h2>
                        <p className="text-gray-400">{selectedInstructor.specialty}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="text-lg font-semibold text-white mb-4 block">
                        Como você avalia este instrutor?
                      </label>
                      <div className="flex flex-col items-center gap-4 p-6 bg-[#1A1A1A] rounded-lg">
                        <StarRating size="lg" />
                        {rating > 0 && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-[#FFD700]"
                          >
                            {rating} {rating === 1 ? 'Estrela' : 'Estrelas'}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-lg font-semibold text-white mb-4 block">
                        Comentários Adicionais (Opcional)
                      </label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Compartilhe sua experiência com este instrutor..."
                        className="min-h-32 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FFD700] resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={rating === 0}
                      className="w-full h-14 bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Avaliação
                    </Button>
                  </form>
                )}
              </Card>
            ) : (
              <Card className="bg-[#0A0A0A] border-[#333333] p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-[#1A1A1A] rounded-full mb-6">
                    <Star className="w-12 h-12 text-gray-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Selecione um Instrutor
                  </h2>
                  <p className="text-gray-400">
                    Escolha um instrutor da lista para enviar sua avaliação
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
