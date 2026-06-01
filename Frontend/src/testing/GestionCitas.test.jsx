// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import GestionCitas from '../pages/GestionCitas';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'fake-token', nombreCompleto: 'Juan Pérez' }),
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

global.fetch = vi.fn();

const citasMock = [
  { id: 1, estado: 'pendiente',  fecha: '2025-06-01', hora: '10:00', medico_nombre: 'Ana',  medico_apellido: 'López',  especialidad: 'Cardiología',     modalidad: 'presencial', sede: 'Norte' },
  { id: 2, estado: 'confirmada', fecha: '2025-06-05', hora: '14:00', medico_nombre: 'Luis', medico_apellido: 'Gómez',  especialidad: 'Dermatología',     modalidad: 'virtual',    sede: 'Sur'   },
  { id: 3, estado: 'cancelada',  fecha: '2025-05-01', hora: '09:00', medico_nombre: 'María',medico_apellido: 'Torres', especialidad: 'Medicina general', modalidad: 'presencial', sede: 'Centro'},
];

const renderGestion = () => render(
  <MemoryRouter initialEntries={['/']}>
    <GestionCitas />
  </MemoryRouter>
);

describe('Componente GestionCitas - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({ ok: true, json: async () => citasMock });
  });

  afterEach(() => cleanup());

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Gestión de citas', () => {
      renderGestion();
      expect(screen.getByRole('heading', { name: 'Gestión de citas' })).toBeInTheDocument();
    });

    it('debe renderizar el campo de búsqueda', () => {
      renderGestion();
      expect(screen.getByPlaceholderText('Buscar por médico, especialidad...')).toBeInTheDocument();
    });

    it('debe renderizar el select de estados', () => {
      renderGestion();
      expect(screen.getByText('Todos los estados')).toBeInTheDocument();
    });

    it('debe renderizar la sección Lista de citas', () => {
      renderGestion();
      expect(screen.getByText('Lista de citas')).toBeInTheDocument();
    });

    it('debe renderizar la sección Resumen', () => {
      renderGestion();
      expect(screen.getByText('Resumen')).toBeInTheDocument();
    });

    it('debe renderizar el botón Agendar nueva cita', () => {
      renderGestion();
      expect(screen.getAllByText('+ Agendar nueva cita').length).toBeGreaterThan(0);
    });

    it('debe renderizar los encabezados de la tabla', () => {
      renderGestion();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
      expect(screen.getByText('Médico')).toBeInTheDocument();
      expect(screen.getByText('Estado')).toBeInTheDocument();
    });

  });

  describe('Carga de citas', () => {

    it('debe mostrar citas después de cargar', async () => {
      renderGestion();
      await waitFor(() => expect(screen.getByText('Cardiología')).toBeInTheDocument());
    });

    it('debe mostrar la especialidad Dermatología', async () => {
      renderGestion();
      await waitFor(() => expect(screen.getByText('Dermatología')).toBeInTheDocument());
    });

    it('debe mostrar el botón cancelar para citas pendientes', async () => {
      renderGestion();
      await waitFor(() => expect(screen.getAllByText('Cancelar').length).toBeGreaterThan(0));
    });

    it('debe mostrar mensaje cuando no hay citas', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
      renderGestion();
      await waitFor(() => expect(screen.getAllByText(/no tienes citas/i).length).toBeGreaterThan(0));
    });

  });

  describe('Filtros y búsqueda', () => {

    it('debe actualizar el campo de búsqueda al escribir', async () => {
      renderGestion();
      const input = screen.getByPlaceholderText('Buscar por médico, especialidad...');
      await userEvent.type(input, 'Cardiología');
      expect(input.value).toBe('Cardiología');
    });

    it('debe filtrar por estado al seleccionar del primer select', async () => {
      renderGestion();
      const selects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selects[0], 'pendiente');
      expect(selects[0].value).toBe('pendiente');
    });

  });

  describe('Modal de cancelación', () => {

    it('debe abrir el modal al hacer clic en Cancelar', async () => {
      renderGestion();
      await waitFor(() => screen.getAllByText('Cancelar'));
      await userEvent.click(screen.getAllByText('Cancelar')[0]);
      expect(screen.getByText('¿Cancelar esta cita?')).toBeVisible();
    });

    it('debe contener el botón No mantener en el modal', async () => {
      renderGestion();
      await waitFor(() => screen.getAllByText('Cancelar'));
      await userEvent.click(screen.getAllByText('Cancelar')[0]);
      expect(screen.getAllByText('No, mantener').length).toBeGreaterThan(0);
    });

    it('debe contener el botón confirmar cancelación en el modal', async () => {
      renderGestion();
      await waitFor(() => screen.getAllByText('Cancelar'));
      await userEvent.click(screen.getAllByText('Cancelar')[0]);
      expect(screen.getAllByText('Sí, cancelar cita').length).toBeGreaterThan(0);
    });

  });

  describe('Navegación', () => {

    it('debe navegar a /agendar al hacer clic en Agendar nueva cita', async () => {
      renderGestion();
      await waitFor(() => screen.getAllByText('+ Agendar nueva cita'));
      await userEvent.click(screen.getAllByText('+ Agendar nueva cita')[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/agendar');
    });

  });

  describe('Integración con el backend', () => {

    it('debe llamar al endpoint de citas al cargar', async () => {
      renderGestion();
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/citas',
          expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
        );
      });
    });

    it('debe manejar error de red sin romper el componente', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderGestion();
      await waitFor(() => expect(screen.getAllByText(/no tienes citas/i).length).toBeGreaterThan(0));
    });

    it('debe mostrar alerta de error si la cancelación falla', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => citasMock })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'No se pudo cancelar.' }) });
      renderGestion();
      await waitFor(() => screen.getAllByText('Cancelar'));
      await userEvent.click(screen.getAllByText('Cancelar')[0]);
      await userEvent.click(screen.getAllByText('Sí, cancelar cita')[0]);
      await waitFor(() => expect(screen.getByText('Error de conexión')).toBeInTheDocument());
    });

  });

});