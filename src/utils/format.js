export const statusLabels = {
  orcamento: 'Orçamento enviado',
  sinal: 'Sinal pago',
  agendado: 'Sessão agendada',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const statusDots = {
  orcamento: '#c0a040',
  sinal: '#7090c0',
  agendado: '#c9a96e',
  concluido: '#6a9e6a',
  cancelado: '#c07070',
};

export function fmt(val) {
  if (!val || isNaN(val)) return 'R$ 0';
  return 'R$ ' + Number(val).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${parseInt(day)} de ${months[parseInt(m) - 1]} de ${y}`;
}

export const monthNames = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

export const dayNamesShort = ['D','S','T','Q','Q','S','S'];
export const dayNamesFull = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
