import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Send, Star } from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from './AppHeader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Toaster } from './ui/sonner';
import {
  createInstructorRating,
  getInitials,
  getRatingErrorMessage,
  getRatingInstructors,
  RatingInstructor,
} from '../../services/ratings';

export function InstructorRating() {
  const [instructors, setInstructors] = useState<RatingInstructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<RatingInstructor | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadInstructors() {
    try {
      setLoading(true);
      const data = await getRatingInstructors();
      setInstructors(data);
      setSelectedInstructor((current) => {
        if (!current) return data[0] ?? null;
        return data.find((instructor) => instructor.id === current.id) ?? data[0] ?? null;
      });
    } catch (error) {
      toast.error(getRatingErrorMessage(error, 'Erro ao carregar instrutores'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedInstructor || rating === 0) return;

    if (selectedInstructor.myRating) {
      toast.error('Voce ja avaliou este instrutor');
      return;
    }

    try {
      setSaving(true);
      await createInstructorRating({
        instructorId: selectedInstructor.id,
        rating,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
      toast.success('Obrigado pelo seu feedback!', {
        description: `Sua avaliacao para ${selectedInstructor.name} foi enviada.`,
      });
      await loadInstructors();

      setTimeout(() => {
        setRating(0);
        setComment('');
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      toast.error(getRatingErrorMessage(error, 'Erro ao enviar avaliacao'));
    } finally {
      setSaving(false);
    }
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <h2 className="text-xl font-bold text-white mb-4">Selecione o Instrutor</h2>
            <div className="space-y-3">
              {loading && (
                <Card className="bg-[#0A0A0A] border-[#333333] p-4">
                  <p className="text-[#FFD700]">Carregando instrutores...</p>
                </Card>
              )}

              {!loading && instructors.length === 0 && (
                <Card className="bg-[#0A0A0A] border-[#333333] p-4">
                  <p className="text-sm text-gray-400">
                    Nenhum instrutor disponivel para avaliacao.
                  </p>
                </Card>
              )}

              {instructors.map((instructor, index) => (
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
                        {getInitials(instructor.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{instructor.name}</h3>
                        <p className="text-xs text-gray-400">Instrutor BlackFit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                      <span className="text-sm font-semibold text-white">
                        {instructor.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({instructor.totalReviews} avaliacoes)
                      </span>
                      {instructor.myRating && (
                        <span className="ml-auto rounded-full bg-[#FFD700]/10 px-2 py-1 text-xs font-semibold text-[#FFD700]">
                          Avaliado
                        </span>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedInstructor ? (
              <Card className="bg-[#0A0A0A] border-[#333333] p-8">
                {selectedInstructor.myRating ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#FFD700] rounded-full mb-6">
                      <CheckCircle2 className="w-12 h-12 text-black" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Avaliacao ja enviada
                    </h2>
                    <p className="text-gray-400">
                      Voce avaliou {selectedInstructor.name} com{' '}
                      <span className="font-semibold text-[#FFD700]">
                        {selectedInstructor.myRating} estrela
                        {selectedInstructor.myRating === 1 ? '' : 's'}
                      </span>
                      .
                    </p>
                    <p className="mt-3 text-sm text-gray-500">
                      Para manter o ranking consistente, cada aluno pode avaliar cada instrutor
                      uma unica vez.
                    </p>
                  </div>
                ) : submitted ? (
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
                    <div className="flex items-center gap-4 pb-6 border-b border-[#333333]">
                      <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center text-2xl font-bold text-black">
                        {getInitials(selectedInstructor.name)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {selectedInstructor.name}
                        </h2>
                        <p className="text-gray-400">
                          Media atual: {selectedInstructor.averageRating.toFixed(1)} de 5
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-lg font-semibold text-white mb-4 block">
                        Como voce avalia este instrutor?
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

                    <div>
                      <label className="text-lg font-semibold text-white mb-4 block">
                        Comentarios adicionais
                      </label>
                      <Textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Compartilhe sua experiencia com este instrutor..."
                        className="min-h-32 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FFD700] resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={rating === 0 || saving}
                      className="w-full h-14 bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {saving ? 'Enviando...' : 'Enviar Avaliacao'}
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
                    Escolha um instrutor da lista para enviar sua avaliacao
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
