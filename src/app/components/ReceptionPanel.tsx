import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRightLeft,
  BadgeCheck,
  Search,
  ShieldPlus,
  SquarePen,
  UserPlus,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from './AppHeader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toaster } from './ui/sonner';
import {
  ApiError,
  assignStudentToInstructor,
  createInstructor,
  createStudent,
  getUsers,
  updateUserById,
  UserItem,
} from '../../services/api';

const emptyInstructorForm = {
  name: '',
  email: '',
  password: '',
};

const emptyStudentForm = {
  name: '',
  email: '',
  password: '',
  instructorId: '',
};

const emptyEditForm = {
  id: '',
  name: '',
  email: '',
  password: '',
  instructorId: '',
  role: '',
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function ReceptionPanel() {
  const [loading, setLoading] = useState(true);
  const [savingInstructor, setSavingInstructor] = useState(false);
  const [savingStudent, setSavingStudent] = useState(false);
  const [linkingStudent, setLinkingStudent] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [instructorForm, setInstructorForm] = useState(emptyInstructorForm);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedInstructorId, setSelectedInstructorId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'TODOS' | 'ALUNO' | 'INSTRUTOR'>('TODOS');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao carregar usuarios'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const instructors = useMemo(
    () => users.filter((user) => user.role === 'INSTRUTOR'),
    [users]
  );

  const students = useMemo(
    () => users.filter((user) => user.role === 'ALUNO'),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const normalizedTerm = deferredSearchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === 'TODOS' ? true : user.role === roleFilter;
      const matchesSearch =
        normalizedTerm.length === 0 ||
        user.name.toLowerCase().includes(normalizedTerm) ||
        user.email.toLowerCase().includes(normalizedTerm);

      return matchesRole && matchesSearch;
    });
  }, [users, deferredSearchTerm, roleFilter]);

  const receptionStats = [
    { icon: Users, label: 'Usuarios cadastrados', value: users.length },
    { icon: ShieldPlus, label: 'Instrutores ativos', value: instructors.length },
    {
      icon: UserPlus,
      label: 'Alunos vinculados',
      value: students.filter((student) => student.instructorId).length,
    },
  ];

  const validateInstructorForm = () => {
    if (!instructorForm.name.trim()) return 'Informe o nome do instrutor';
    if (!isValidEmail(instructorForm.email)) return 'Informe um email valido para o instrutor';
    if (instructorForm.password.trim().length < 6) {
      return 'A senha inicial precisa ter pelo menos 6 caracteres';
    }
    return null;
  };

  const validateStudentForm = () => {
    if (!studentForm.name.trim()) return 'Informe o nome do aluno';
    if (!isValidEmail(studentForm.email)) return 'Informe um email valido para o aluno';
    if (studentForm.password.trim().length < 6) {
      return 'A senha inicial precisa ter pelo menos 6 caracteres';
    }
    if (!studentForm.instructorId) return 'Selecione um instrutor responsavel';
    return null;
  };

  const validateEditForm = () => {
    if (!editForm.name.trim()) return 'Informe o nome do usuario';
    if (!isValidEmail(editForm.email)) return 'Informe um email valido';
    if (editForm.password && editForm.password.trim().length < 6) {
      return 'Se quiser alterar a senha, use pelo menos 6 caracteres';
    }
    if (editForm.role === 'ALUNO' && !editForm.instructorId) {
      return 'Selecione um instrutor para o aluno';
    }
    return null;
  };

  const handleCreateInstructor = async () => {
    const validationError = validateInstructorForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSavingInstructor(true);
      await createInstructor({
        name: instructorForm.name.trim(),
        email: instructorForm.email.trim(),
        password: instructorForm.password,
      });
      setInstructorForm(emptyInstructorForm);
      await loadUsers();
      toast.success('Instrutor cadastrado com sucesso');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao criar instrutor'));
    } finally {
      setSavingInstructor(false);
    }
  };

  const handleCreateStudent = async () => {
    const validationError = validateStudentForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSavingStudent(true);
      await createStudent({
        name: studentForm.name.trim(),
        email: studentForm.email.trim(),
        password: studentForm.password,
        instructorId: studentForm.instructorId,
      });
      setStudentForm(emptyStudentForm);
      await loadUsers();
      toast.success('Aluno cadastrado e vinculado com sucesso');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao criar aluno'));
    } finally {
      setSavingStudent(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedStudentId || !selectedInstructorId) {
      toast.error('Selecione o aluno e o instrutor');
      return;
    }

    try {
      setLinkingStudent(true);
      await assignStudentToInstructor(selectedStudentId, selectedInstructorId);
      setSelectedStudentId('');
      setSelectedInstructorId('');
      await loadUsers();
      toast.success('Aluno vinculado ao instrutor com sucesso');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao atualizar vinculo'));
    } finally {
      setLinkingStudent(false);
    }
  };

  const openEditDialog = (user: UserItem) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      instructorId: user.instructorId || '',
      role: user.role,
    });
    setIsEditingUser(true);
  };

  const handleSaveEdit = async () => {
    const validationError = validateEditForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSavingEdit(true);
      await updateUserById(editForm.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        ...(editForm.password ? { password: editForm.password } : {}),
        ...(editForm.role === 'ALUNO' ? { instructorId: editForm.instructorId } : {}),
      });
      setIsEditingUser(false);
      setEditForm(emptyEditForm);
      await loadUsers();
      toast.success('Cadastro atualizado com sucesso');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao atualizar cadastro'));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-center" theme="dark" />
      <AppHeader receptionMode />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#FFD700]">
              <BadgeCheck className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-[0.14em]">
                Recepcao
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white">Gestao de Cadastros</h1>
            <p className="text-gray-400">
              Cadastre instrutores, crie alunos e mantenha os vinculos organizados.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {receptionStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#0A0A0A] border-[#333333] p-6 hover:border-[#FFD700] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-[#FFD700]" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <Card className="bg-[#0A0A0A] border-[#333333] p-10">
            <div className="flex items-center justify-center text-[#FFD700]">
              Carregando cadastros...
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[#FFD700] font-semibold">Fluxo 1</p>
                    <h2 className="text-xl font-bold text-white">Novo Instrutor</h2>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                    <ShieldPlus className="w-5 h-5 text-[#FFD700]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    value={instructorForm.name}
                    onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
                    placeholder="Nome do instrutor"
                    className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
                  />
                  <Input
                    value={instructorForm.email}
                    onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
                    placeholder="Email profissional"
                    className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
                  />
                  <Input
                    type="password"
                    value={instructorForm.password}
                    onChange={(e) => setInstructorForm({ ...instructorForm, password: e.target.value })}
                    placeholder="Senha inicial"
                    className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
                  />
                  <Button
                    onClick={handleCreateInstructor}
                    disabled={savingInstructor}
                    className="h-12 w-full bg-[#FFD700] text-black hover:bg-[#FFC700]"
                  >
                    {savingInstructor ? 'Cadastrando...' : 'Cadastrar instrutor'}
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[#FFD700] font-semibold">Fluxo 2</p>
                    <h2 className="text-xl font-bold text-white">Novo Aluno</h2>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-[#FFD700]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="Nome do aluno"
                    className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
                  />
                  <Input
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="Email do aluno"
                    className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
                  />
                  <Input
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Senha inicial"
                    className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
                  />
                  <Select
                    value={studentForm.instructorId}
                    onValueChange={(value) => setStudentForm({ ...studentForm, instructorId: value })}
                  >
                    <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectValue placeholder="Instrutor responsavel" />
                    </SelectTrigger>
                    <SelectContent className="border-[#333333] bg-[#111111] text-white">
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleCreateStudent}
                    disabled={savingStudent}
                    className="h-12 w-full bg-[#FFD700] text-black hover:bg-[#FFC700]"
                  >
                    {savingStudent ? 'Cadastrando...' : 'Cadastrar aluno'}
                  </Button>
                </div>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-[#FFD700] font-semibold">Fluxo 3</p>
                    <h2 className="text-xl font-bold text-white">Ajustar Vinculo</h2>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-[#FFD700]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectValue placeholder="Selecione o aluno" />
                    </SelectTrigger>
                    <SelectContent className="border-[#333333] bg-[#111111] text-white">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedInstructorId} onValueChange={setSelectedInstructorId}>
                    <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectValue placeholder="Novo instrutor" />
                    </SelectTrigger>
                    <SelectContent className="border-[#333333] bg-[#111111] text-white">
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleAssignStudent}
                    disabled={linkingStudent}
                    variant="outline"
                    className="h-12 w-full border-[#333333] text-[#FFD700] hover:bg-[#1A1A1A]"
                  >
                    {linkingStudent ? 'Atualizando...' : 'Atualizar vinculo'}
                  </Button>

                  <p className="text-sm leading-6 text-gray-400">
                    Use para reorganizar a carteira de alunos sem recriar cadastros.
                  </p>
                </div>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-sm text-[#FFD700] font-semibold">Instrutores</p>
                    <h3 className="text-xl font-bold text-white">Equipe Ativa</h3>
                  </div>
                  <span className="rounded-full border border-[#333333] px-3 py-1 text-xs text-gray-400">
                    {instructors.length} cadastrados
                  </span>
                </div>

                <div className="space-y-3">
                  {instructors.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#333333] p-5 text-sm text-gray-400">
                      Nenhum instrutor cadastrado ainda.
                    </div>
                  ) : (
                    instructors.map((instructor) => (
                      <div key={instructor.id} className="rounded-lg border border-[#333333] bg-[#1A1A1A] p-4">
                        <p className="font-semibold text-white">{instructor.name}</p>
                        <p className="mt-1 text-sm text-gray-400">{instructor.email}</p>
                        <p className="mt-2 text-xs font-semibold text-[#FFD700]">Instrutor</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-5">
                  <div>
                    <p className="text-sm text-[#FFD700] font-semibold">Cadastro</p>
                    <h3 className="text-xl font-bold text-white">Busca e Manutencao</h3>
                  </div>
                  <span className="rounded-full border border-[#333333] px-3 py-1 text-xs text-gray-400">
                    {filteredUsers.length} visiveis
                  </span>
                </div>

                <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome ou email"
                      className="h-12 bg-[#1A1A1A] border-[#333333] pl-11 text-white"
                    />
                  </div>

                  <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as typeof roleFilter)}>
                    <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#333333] bg-[#111111] text-white">
                      <SelectItem value="TODOS">Todos</SelectItem>
                      <SelectItem value="INSTRUTOR">Instrutores</SelectItem>
                      <SelectItem value="ALUNO">Alunos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#333333] p-5 text-sm text-gray-400">
                      Nenhum usuario encontrado para os filtros atuais.
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const instructor = instructors.find((item) => item.id === user.instructorId);

                      return (
                        <div key={user.id} className="rounded-lg border border-[#333333] bg-[#1A1A1A] p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-white">{user.name}</p>
                              <p className="mt-1 text-sm text-gray-400">{user.email}</p>
                            </div>

                            {user.role !== 'RECEPCIONISTA' && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => openEditDialog(user)}
                                className="border-[#333333] text-[#FFD700] hover:bg-[#0A0A0A]"
                              >
                                <SquarePen className="mr-2 w-4 h-4" />
                                Editar
                              </Button>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            <span className="rounded-full bg-[#FFD700]/10 px-3 py-1 text-xs font-semibold text-[#FFD700]">
                              {user.role === 'INSTRUTOR'
                                ? 'Instrutor'
                                : user.role === 'RECEPCIONISTA'
                                ? 'Recepcionista'
                                : 'Aluno'}
                            </span>
                            {user.role === 'ALUNO' && (
                              <span className="text-gray-400">
                                Instrutor responsavel:{' '}
                                <span className="font-semibold text-white">
                                  {instructor?.name || 'Nao vinculado'}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          </>
        )}
      </main>

      <Dialog
        open={isEditingUser}
        onOpenChange={(open) => {
          setIsEditingUser(open);
          if (!open) setEditForm(emptyEditForm);
        }}
      >
        <DialogContent className="border-[#333333] bg-[#0A0A0A] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Editar cadastro</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Nome"
              className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
            />
            <Input
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Email"
              className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
            />
            <Input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              placeholder="Nova senha opcional"
              className="h-12 bg-[#1A1A1A] border-[#333333] text-white"
            />

            {editForm.role === 'ALUNO' && (
              <Select
                value={editForm.instructorId}
                onValueChange={(value) => setEditForm({ ...editForm, instructorId: value })}
              >
                <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                  <SelectValue placeholder="Selecione o instrutor" />
                </SelectTrigger>
                <SelectContent className="border-[#333333] bg-[#111111] text-white">
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={handleSaveEdit}
              disabled={savingEdit}
              className="h-12 w-full bg-[#FFD700] text-black hover:bg-[#FFC700]"
            >
              {savingEdit ? 'Salvando...' : 'Salvar alteracoes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
