// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Historial from '../pages/Historial';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    token: 'fake-token',
    nombreCompleto: 'Juan Pérez',
    iniciales: 'JP',
    usuario: { rol: 'paciente', correo: 'juan@test.com' },
  }),
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

global.fetch = vi.fn();

const consultasMock = [
  { id: 1, estado: 'completada', fecha: '2025-05-01', hora: '10:00', medico_nombre: 'Ana', medico_apellido: 'López', especialidad: 'Cardiología', modalidad: 'presencial' },
];

const renderHistorial = () => render(
  <MemoryRouter>
    <Historial />
  </MemoryRouter>
);

describe('Componente Historial - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Historial clínico', () => {
      renderHistorial();
      expect(screen.getByRole('heading', { name: 'Historial clínico' })).toBeInTheDocument();
    });

    it('debe renderizar el subtítulo', () => {
      renderHistorial();
      expect(screen.getByText('Solo los usuarios autorizados pueden consultar información médica sensible.')).toBeInTheDocument();
    });

    it('debe renderizar la alerta de Acceso registrado', () => {
      renderHistorial();
      expect(screen.getAllByText('Acceso registrado').length).toBeGreaterThan(0);
    });

    it('debe renderizar el nombre del usuario', () => {
      renderHistorial();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });

    it('debe renderizar las iniciales del usuario', () => {
      renderHistorial();
      expect(screen.getByText('JP')).toBeInTheDocument();
    });

    it('debe renderizar el rol del usuario', () => {
      renderHistorial();
      expect(screen.getAllByText('Paciente').length).toBeGreaterThan(0);
    });

    it('debe renderizar el aviso de privacidad', () => {
      renderHistorial();
      expect(screen.getByText(/Aviso de privacidad/i)).toBeInTheDocument();
    });

    it('debe renderizar la tarjeta Acceso autorizado', () => {
      renderHistorial();
      expect(screen.getByText('Acceso autorizado')).toBeInTheDocument();
    });

  });

  describe('Tabs de navegación', () => {

    it('debe renderizar todas las pestañas', () => {
      renderHistorial();
      expect(screen.getByText('Resumen clínico')).toBeInTheDocument();
      expect(screen.getByText('Antecedentes')).toBeInTheDocument();
      expect(screen.getByText('Alergias')).toBeInTheDocument();
      expect(screen.getByText('Medicación actual')).toBeInTheDocument();
      expect(screen.getAllByText('Consultas previas').length).toBeGreaterThan(0);
      expect(screen.getByText('Exámenes y resultados')).toBeInTheDocument();
    });

    it('debe mostrar el resumen clínico por defecto', () => {
      renderHistorial();
      expect(screen.getByText(/El resumen clínico se generará/i)).toBeInTheDocument();
    });

    it('debe cambiar a la pestaña Antecedentes al hacer clic', async () => {
      renderHistorial();
      await userEvent.click(screen.getByText('Antecedentes'));
      expect(screen.getByText('Sin antecedentes registrados.')).toBeInTheDocument();
    });

    it('debe cambiar a la pestaña Alergias al hacer clic', async () => {
      renderHistorial();
      await userEvent.click(screen.getByText('Alergias'));
      expect(screen.getByText('Sin alergias registradas.')).toBeInTheDocument();
    });

    it('debe cambiar a la pestaña Medicación al hacer clic', async () => {
      renderHistorial();
      await userEvent.click(screen.getByText('Medicación actual'));
      expect(screen.getByText('Sin medicación activa registrada.')).toBeInTheDocument();
    });

    it('debe cambiar a la pestaña Consultas previas al hacer clic', async () => {
      renderHistorial();
      await userEvent.click(screen.getAllByText('Consultas previas')[0]);
      expect(screen.getAllByText('Consultas previas').length).toBeGreaterThan(1);
    });

    it('debe cambiar a la pestaña Exámenes al hacer clic', async () => {
      renderHistorial();
      await userEvent.click(screen.getByText('Exámenes y resultados'));
      expect(screen.getByText('Sin exámenes registrados.')).toBeInTheDocument();
    });

  });

  describe('Carga de consultas', () => {

    it('debe mostrar mensaje cuando no hay consultas previas', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
      renderHistorial();
      await userEvent.click(screen.getAllByText('Consultas previas')[0]);
      await waitFor(() => expect(screen.getByText('No hay consultas previas registradas.')).toBeInTheDocument());
    });

    it('debe mostrar consultas completadas en la pestaña', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => consultasMock });
      renderHistorial();
      await userEvent.click(screen.getAllByText('Consultas previas')[0]);
      await waitFor(() => expect(screen.getByText('Cardiología')).toBeInTheDocument());
    });

    it('debe filtrar solo citas completadas', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          ...consultasMock,
          { id: 2, estado: 'pendiente', fecha: '2025-06-01', hora: '11:00', medico_nombre: 'Luis', medico_apellido: 'Gómez', especialidad: 'Dermatología', modalidad: 'virtual' },
        ],
      });
      renderHistorial();
      await userEvent.click(screen.getAllByText('Consultas previas')[0]);
      await waitFor(() => expect(screen.getByText('Cardiología')).toBeInTheDocument());
      expect(screen.queryByText('Dermatología')).not.toBeInTheDocument();
    });

  });

  describe('Integración con el backend', () => {

    it('debe llamar al endpoint de citas al cargar', async () => {
      renderHistorial();
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/citas',
          expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
        );
      });
    });

    it('debe manejar error de red sin romper el componente', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderHistorial();
      await userEvent.click(screen.getAllByText('Consultas previas')[0]);
      await waitFor(() => expect(screen.getByText('No hay consultas previas registradas.')).toBeInTheDocument());
    });

    it('no debe mostrar consultas si la respuesta no es ok', async () => {
      global.fetch.mockResolvedValueOnce({ ok: false, json: async () => [] });
      renderHistorial();
      await userEvent.click(screen.getAllByText('Consultas previas')[0]);
      await waitFor(() => expect(screen.getByText('No hay consultas previas registradas.')).toBeInTheDocument());
    });

  });

});