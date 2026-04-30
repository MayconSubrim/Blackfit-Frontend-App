import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, LogOut, Menu, Star, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { getRoleLabel } from '../../services/auth';
import { useAuth } from '../auth/AuthContext';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

type ActivePage = 'workouts' | 'check-in' | 'rating';

type AppHeaderProps = {
  activePage?: ActivePage;
  showBackButton?: boolean;
  instructorMode?: boolean;
  noPrint?: boolean;
};

export function AppHeader({
  activePage,
  showBackButton = false,
  instructorMode = false,
  noPrint = false,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const userName = user?.name || 'Usuário';
  const roleLabel = getRoleLabel(user?.role);

  const handleLogout = () => {
    // limpa token e dados do usuario antes de voltar para o login
    signOut();
    navigate('/');
  };

  const getNavClass = (page: ActivePage) =>
    activePage === page
      ? 'text-[#FFD700] bg-[#FFD700]/10'
      : 'text-white hover:text-[#FFD700] hover:bg-[#1A1A1A]';

  const studentNav = (
    <>
      <Button
        onClick={() => navigate('/dashboard')}
        variant="ghost"
        className={getNavClass('workouts')}
      >
        <img src={logoImage} alt="" className="w-4 h-4 mr-2 opacity-70" />
        Treinos
      </Button>
      <Button
        onClick={() => navigate('/check-in')}
        variant="ghost"
        className={getNavClass('check-in')}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Check-in
      </Button>
      <Button
        onClick={() => navigate('/rate-instructor')}
        variant="ghost"
        className={getNavClass('rating')}
      >
        <Star className="w-4 h-4 mr-2" />
        Avaliar Instrutor
      </Button>
    </>
  );

  return (
    <header
      className={`bg-[#0A0A0A] border-b border-[#333333] sticky top-0 z-50 ${
        noPrint ? 'no-print' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                size="icon"
                className="text-[#FFD700]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logoImage} alt="BlackFit" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">BlackFit</span>
              {instructorMode && (
                <span className="ml-2 text-xs bg-[#FFD700] text-black px-2 py-1 rounded font-semibold">
                  INSTRUTOR
                </span>
              )}
            </div>
          </div>

          {!instructorMode && <nav className="hidden md:flex items-center gap-2">{studentNav}</nav>}

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-gray-400">{roleLabel}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-[#FFD700]"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {!instructorMode && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          )}

          {instructorMode && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-[#FFD700]"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </div>

        {!instructorMode && menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden py-4 space-y-2 [&>button]:w-full [&>button]:justify-start"
          >
            {studentNav}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-[#FFD700]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
