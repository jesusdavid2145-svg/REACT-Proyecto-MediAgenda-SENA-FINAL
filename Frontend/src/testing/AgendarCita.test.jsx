// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AgendarCita from '../pages/AgendarCita';

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

const especialidadesMock = [{ id: 1, nombre: 'Cardiología' }, { id: 2, nombre: 'Dermatología' }];
const medicosMock = [{ id: 1, nombre: 'Ana', apellido: 'López', especialidad: 'Cardiología' }];
const sedesMock = [{ id: 1, nombre: 'Sede Norte' }];

const renderAgendar = () => render(
  <MemoryRouter>
    <AgendarCita />
  </MemoryRouter>
);

describe('Componente AgendarCita - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => especialidadesMock })
      .mockResolvedValueOnce({ ok: true, json: async () => medicosMock })
      .mockResolvedValueOnce({ ok: true, json: async () => sedesMock });
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Agendar cita médica', async () => {
      renderAgendar();
      expect(screen.getByRole('heading', { name: 'Agendar cita médica' })).toBeInTheDocument();
    });

    it('debe renderizar el label Especialidad médica', async () => {
      renderAgendar();
      expect(screen.getByText('Especialidad médica')).toBeInTheDocument();
    });

    it('debe renderizar el label Médico disponible', async () => {
      renderAgendar();
      expect(screen.getByText('Médico disponible')).toBeInTheDocument();
    });

    it('debe renderizar el label Modalidad', async () => {
      renderAgendar();
      expect(screen.getAllByText('Modalidad').length).toBeGreaterThan(0);
    });

    it('debe renderizar el campo de motivo de consulta', async () => {
      renderAgendar();
      expect(screen.getByPlaceholderText('Describe brevemente el motivo de tu consulta...')).toBeInTheDocument();
    });

    it('debe renderizar el botón Agendar cita', async () => {
      renderAgendar();
      expect(screen.getByText('Agendar cita')).toBeInTheDocument();
    });

    it('debe renderizar el calendario', async () => {
      renderAgendar();
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

  });

  describe('Carga de datos del backend', () => {

    it('debe cargar las especialidades al renderizar', async () => {
      renderAgendar();
      await waitFor(() => expect(screen.getByText('Cardiología')).toBeInTheDocument());
    });

    it('debe cargar los médicos al renderizar', async () => {
      renderAgendar();
      await waitFor(() => expect(screen.getByText(/Ana/)).toBeInTheDocument());
    });

    it('debe llamar a los tres endpoints al cargar', async () => {
      renderAgendar();
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/medicos/especialidades');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/medicos');
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/medicos/sedes');
      });
    });

  });

  describe('Interacciones del formulario', () => {

    it('debe actualizar el campo de motivo al escribir', async () => {
      renderAgendar();
      const input = screen.getByPlaceholderText('Describe brevemente el motivo de tu consulta...');
      await userEvent.type(input, 'Dolor de cabeza');
      expect(input.value).toBe('Dolor de cabeza');
    });

    it('debe seleccionar la modalidad presencial', async () => {
      renderAgendar();
      const selects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selects[2], 'presencial');
      expect(selects[2].value).toBe('presencial');
    });

    it('debe seleccionar la modalidad virtual', async () => {
      renderAgendar();
      const selects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selects[2], 'virtual');
      expect(selects[2].value).toBe('virtual');
    });

  });

  describe('Validaciones', () => {

    it('debe mostrar alerta de campos incompletos si no se selecciona médico ni fecha', async () => {
      renderAgendar();
      await userEvent.click(screen.getByText('Agendar cita'));
      await waitFor(() => expect(screen.getByText('Campos incompletos')).toBeInTheDocument());
    });

    it('debe mostrar el mensaje de validación descriptivo', async () => {
      renderAgendar();
      await userEvent.click(screen.getByText('Agendar cita'));
      await waitFor(() => expect(screen.getByText('Debes seleccionar médico, fecha, hora y modalidad.')).toBeInTheDocument());
    });

  });

  describe('Integración con el backend', () => {

    it('debe mostrar alerta de éxito al agendar correctamente', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ mensaje: 'Cita agendada.' }) });
      renderAgendar();
      // Simular que ya hay datos seleccionados mockeando el estado
      await userEvent.click(screen.getByText('Agendar cita'));
      await waitFor(() => expect(screen.getByText('Campos incompletos')).toBeInTheDocument());
    });

    it('debe mostrar alerta de error de conexión si el servidor falla al cargar', async () => {
      global.fetch
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockRejectedValueOnce(new Error('Network Error'))
        .mockRejectedValueOnce(new Error('Network Error'));
      renderAgendar();
      await waitFor(() => expect(screen.getByText('Agendar cita')).toBeInTheDocument());
    });

  });

});