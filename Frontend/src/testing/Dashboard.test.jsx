// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    token: 'fake-token',
    nombreCompleto: 'Juan Pérez',
  }),
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

global.fetch = vi.fn();

const renderDashboard = () => render(
  <MemoryRouter initialEntries={['/']}>
    <Dashboard />
  </MemoryRouter>
);

describe('Componente Dashboard - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el saludo con el nombre del usuario', async () => {
      renderDashboard();
      await waitFor(() => expect(screen.getByText(/Hola,/i)).toBeInTheDocument());
    });

    it('debe renderizar el nombre Juan', async () => {
      renderDashboard();
      await waitFor(() => expect(screen.getByText('Juan')).toBeInTheDocument());
    });

    it('debe renderizar el subtítulo del dashboard', async () => {
      renderDashboard();
      expect(screen.getByText('Este es el resumen de tu actividad en MediAgenda.')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta Próxima cita', async () => {
      renderDashboard();
      expect(screen.getByText('Próxima cita')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta Citas programadas', async () => {
      renderDashboard();
      expect(screen.getByText('Citas programadas')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta Notificaciones', async () => {
      renderDashboard();
      expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta Historial clínico', async () => {
      renderDashboard();
      expect(screen.getByText('Historial clínico')).toBeInTheDocument();
    });

    it('debe renderizar la sección Próximas citas', async () => {
      renderDashboard();
      expect(screen.getByText('Próximas citas')).toBeInTheDocument();
    });

    it('debe renderizar la sección Acciones rápidas', async () => {
      renderDashboard();
      expect(screen.getByText('Acciones rápidas')).toBeInTheDocument();
    });

    it('debe renderizar la sección Consejo de salud', async () => {
      renderDashboard();
      expect(screen.getByText('Consejo de salud')).toBeInTheDocument();
    });

    it('debe renderizar los encabezados de la tabla', async () => {
      renderDashboard();
      expect(screen.getByText('Fecha')).toBeInTheDocument();
      expect(screen.getByText('Médico')).toBeInTheDocument();
      expect(screen.getByText('Especialidad')).toBeInTheDocument();
    });

  });

  describe('Estado de carga', () => {

    it('debe mostrar "Cargando citas..." mientras carga', async () => {
      global.fetch.mockImplementationOnce(() => new Promise(() => {}));
      renderDashboard();
      expect(screen.getByText('Cargando citas...')).toBeInTheDocument();
    });

    it('debe mostrar "No tienes citas próximas." cuando no hay citas', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });
      renderDashboard();
      await waitFor(() => expect(screen.getByText('No tienes citas próximas.')).toBeInTheDocument());
    });

    it('debe mostrar citas cuando el backend retorna datos', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { estado: 'pendiente', fecha: '2025-06-01', hora: '10:00', medico_nombre: 'Ana', medico_apellido: 'López', especialidad: 'Cardiología' },
        ]),
      });
      renderDashboard();
      await waitFor(() => expect(screen.getByText('Cardiología')).toBeInTheDocument());
    });

    it('debe mostrar el total de citas en la tarjeta', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { estado: 'pendiente', fecha: '2025-06-01', hora: '10:00', medico_nombre: 'Ana', medico_apellido: 'López', especialidad: 'Cardiología' },
          { estado: 'completada', fecha: '2025-05-01', hora: '09:00', medico_nombre: 'Luis', medico_apellido: 'Gómez', especialidad: 'Medicina general' },
        ]),
      });
      renderDashboard();
      await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument());
    });

  });

  describe('Navegación', () => {

    it('debe navegar a /mis-citas al hacer clic en "Ver detalles"', async () => {
      renderDashboard();
      await waitFor(() => screen.getByText('Ver detalles ›'));
      await userEvent.click(screen.getByText('Ver detalles ›'));
      expect(mockNavigate).toHaveBeenCalledWith('/mis-citas');
    });

    it('debe navegar a /notificaciones al hacer clic en "Ver notificaciones"', async () => {
      renderDashboard();
      await waitFor(() => screen.getByText('Ver notificaciones ›'));
      await userEvent.click(screen.getByText('Ver notificaciones ›'));
      expect(mockNavigate).toHaveBeenCalledWith('/notificaciones');
    });

    it('debe navegar a /historial al hacer clic en "Ver historial"', async () => {
      renderDashboard();
      await waitFor(() => screen.getByText('Ver historial ›'));
      await userEvent.click(screen.getByText('Ver historial ›'));
      expect(mockNavigate).toHaveBeenCalledWith('/historial');
    });

    it('debe navegar a /agendar al hacer clic en "Agendar nueva cita"', async () => {
      renderDashboard();
      await userEvent.click(screen.getByText('Agendar nueva cita'));
      expect(mockNavigate).toHaveBeenCalledWith('/agendar');
    });

    it('debe navegar a /historial al hacer clic en "Ver historial clínico"', async () => {
      renderDashboard();
      await userEvent.click(screen.getByText('Ver historial clínico'));
      expect(mockNavigate).toHaveBeenCalledWith('/historial');
    });

    it('debe navegar a /ajustes al hacer clic en "Actualizar perfil"', async () => {
      renderDashboard();
      await userEvent.click(screen.getByText('Actualizar perfil'));
      expect(mockNavigate).toHaveBeenCalledWith('/ajustes');
    });

    it('debe navegar a /mis-citas al hacer clic en "Ver todas"', async () => {
      renderDashboard();
      await userEvent.click(screen.getByText('Ver todas'));
      expect(mockNavigate).toHaveBeenCalledWith('/mis-citas');
    });

  });

  describe('Integración con el backend', () => {

    it('debe llamar al endpoint de citas al cargar', async () => {
      renderDashboard();
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/citas',
          expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
        );
      });
    });

    it('no debe mostrar citas si la respuesta no es ok', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false, json: async () => [] });
      renderDashboard();
      await waitFor(() => expect(screen.getByText('No tienes citas próximas.')).toBeInTheDocument());
    });

    it('debe manejar error de red sin romper el componente', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderDashboard();
      await waitFor(() => expect(screen.getByText('No tienes citas próximas.')).toBeInTheDocument());
    });

  });

});