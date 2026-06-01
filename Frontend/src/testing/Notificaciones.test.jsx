// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Notificaciones from '../pages/Notificaciones';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'fake-token' }),
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

global.fetch = vi.fn();

const renderNotificaciones = () => render(
  <MemoryRouter>
    <Notificaciones />
  </MemoryRouter>
);

// Helper para hacer clic en el botón filtro (no en el span del resumen)
const clickFiltro = async (label) => {
  const btns = screen.getAllByText(label);
  const btn = btns.find(el => el.tagName === 'BUTTON');
  await userEvent.click(btn);
};

describe('Componente Notificaciones - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({ ok: false, json: async () => [] });
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Notificaciones', () => {
      renderNotificaciones();
      expect(screen.getByRole('heading', { name: 'Notificaciones' })).toBeInTheDocument();
    });

    it('debe renderizar el subtítulo', () => {
      renderNotificaciones();
      expect(screen.getByText('Consulta avisos, recordatorios y actualizaciones importantes de tu cuenta.')).toBeInTheDocument();
    });

    it('debe renderizar los filtros', () => {
      renderNotificaciones();
      expect(screen.getByText('Todas')).toBeInTheDocument();
      expect(screen.getByText('Recordatorios')).toBeInTheDocument();
      expect(screen.getAllByText('Sistema').length).toBeGreaterThan(0);
    });

    it('debe renderizar el botón Marcar todas como leídas', () => {
      renderNotificaciones();
      expect(screen.getByText('Marcar todas como leídas')).toBeInTheDocument();
    });

    it('debe renderizar la sección Resumen', () => {
      renderNotificaciones();
      expect(screen.getByText('Resumen')).toBeInTheDocument();
    });

    it('debe renderizar las acciones rápidas', () => {
      renderNotificaciones();
      expect(screen.getByText('Acciones rápidas')).toBeInTheDocument();
    });

    it('debe renderizar notificaciones locales por defecto', () => {
      renderNotificaciones();
      expect(screen.getByText('Recordatorio de cita')).toBeInTheDocument();
      expect(screen.getByText('Cita reprogramada')).toBeInTheDocument();
    });

  });

  describe('Filtros', () => {

    it('debe mostrar solo recordatorios al filtrar', async () => {
      renderNotificaciones();
      await userEvent.click(screen.getByText('Recordatorios'));
      expect(screen.getByText('Recordatorio de cita')).toBeInTheDocument();
      expect(screen.queryByText('Actualización de seguridad')).not.toBeInTheDocument();
    });

    it('debe mostrar solo sistema al filtrar', async () => {
      renderNotificaciones();
      await clickFiltro('Sistema');
      expect(screen.getByText('Confirmación de cita')).toBeInTheDocument();
      expect(screen.queryByText('Recordatorio de cita')).not.toBeInTheDocument();
    });

    it('debe mostrar solo no leídas al filtrar', async () => {
      renderNotificaciones();
      await clickFiltro('No leídas');
      expect(screen.getByText('Recordatorio de cita')).toBeInTheDocument();
      expect(screen.queryByText('Confirmación de cita')).not.toBeInTheDocument();
    });

    it('debe mostrar todas al hacer clic en Todas', async () => {
      renderNotificaciones();
      await clickFiltro('No leídas');
      await userEvent.click(screen.getByText('Todas'));
      expect(screen.getByText('Recordatorio de cita')).toBeInTheDocument();
      expect(screen.getByText('Confirmación de cita')).toBeInTheDocument();
    });

  });

  describe('Acciones', () => {

    it('debe marcar todas como leídas al hacer clic', async () => {
      renderNotificaciones();
      await userEvent.click(screen.getByText('Marcar todas como leídas'));
      await waitFor(() => expect(screen.getByText('Todas leídas')).toBeInTheDocument());
    });

    it('debe archivar una notificación al hacer clic en archivar', async () => {
      renderNotificaciones();
      const archiveBtns = screen.getAllByTitle('Archivar');
      await userEvent.click(archiveBtns[0]);
      await waitFor(() => expect(screen.getByText('Archivada')).toBeInTheDocument());
    });

    it('debe marcar como leída al hacer clic en el ojo', async () => {
      renderNotificaciones();
      const eyeBtns = screen.getAllByTitle(/Marcar como/i);
      await userEvent.click(eyeBtns[0]);
      await waitFor(() => expect(screen.getByText('Actualizado')).toBeInTheDocument());
    });

  });

  describe('Navegación', () => {

    it('debe navegar a /agendar al hacer clic', async () => {
      renderNotificaciones();
      await userEvent.click(screen.getByText('Agendar cita'));
      expect(mockNavigate).toHaveBeenCalledWith('/agendar');
    });

    it('debe navegar a /mis-citas al hacer clic', async () => {
      renderNotificaciones();
      await userEvent.click(screen.getByText('Mis citas'));
      expect(mockNavigate).toHaveBeenCalledWith('/mis-citas');
    });

    it('debe navegar a /ajustes al hacer clic', async () => {
      renderNotificaciones();
      await userEvent.click(screen.getByText('Ajustes'));
      expect(mockNavigate).toHaveBeenCalledWith('/ajustes');
    });

  });

  describe('Integración con el backend', () => {

    it('debe llamar al endpoint de notificaciones al cargar', async () => {
      renderNotificaciones();
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/notificaciones',
          expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
        );
      });
    });

    it('debe usar datos locales si el backend falla', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderNotificaciones();
      await waitFor(() => expect(screen.getByText('Recordatorio de cita')).toBeInTheDocument());
    });

    it('debe cargar notificaciones del backend si la respuesta es ok', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: 10, tipo: 'sistema', titulo: 'Notificación backend', mensaje: 'Mensaje del servidor', creado_en: '2025-06-01T10:00:00', leida: 0 },
        ]),
      });
      renderNotificaciones();
      await waitFor(() => expect(screen.getByText('Notificación backend')).toBeInTheDocument());
    });

  });

});