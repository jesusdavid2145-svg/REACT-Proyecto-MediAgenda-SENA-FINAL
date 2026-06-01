// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Reportes from '../pages/Reportes';

// Mock de canvas para jsdom
HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  measureText: () => ({ width: 0 }),
  setLineDash: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  createLinearGradient: () => ({ addColorStop: vi.fn() }),
  rect: vi.fn(),
  roundRect: vi.fn(),
  clip: vi.fn(),
  quadraticCurveTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  closePath: vi.fn(),
  textAlign: '',
  textBaseline: '',
  lineWidth: 0,
  strokeStyle: '',
  fillStyle: '',
  font: '',
  globalAlpha: 1,
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'fake-token' }),
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

global.fetch = vi.fn();

const renderReportes = () => render(
  <MemoryRouter>
    <Reportes />
  </MemoryRouter>
);

describe('Componente Reportes - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({ ok: true, json: async () => [] });
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Reportes administrativos', () => {
      renderReportes();
      expect(screen.getByRole('heading', { name: 'Reportes administrativos' })).toBeInTheDocument();
    });

    it('debe renderizar el subtítulo', () => {
      renderReportes();
      expect(screen.getByText('Genera, consulta y exporta reportes de citas, usuarios y actividad del sistema.')).toBeInTheDocument();
    });

    it('debe renderizar el filtro Rango de fechas', () => {
      renderReportes();
      expect(screen.getByText('Rango de fechas')).toBeInTheDocument();
    });

    it('debe renderizar el filtro Estado', () => {
      renderReportes();
      expect(screen.getAllByText('Estado').length).toBeGreaterThan(0);
    });

    it('debe renderizar el filtro Especialidad', () => {
      renderReportes();
      expect(screen.getByText('Especialidad')).toBeInTheDocument();
    });

    it('debe renderizar el filtro Modalidad', () => {
      renderReportes();
      expect(screen.getByText('Modalidad')).toBeInTheDocument();
    });

    it('debe renderizar el botón Generar reporte', () => {
      renderReportes();
      expect(screen.getByText('Generar reporte')).toBeInTheDocument();
    });

    it('debe renderizar el botón Limpiar filtros', () => {
      renderReportes();
      expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
    });

    it('debe renderizar el botón Exportar', () => {
      renderReportes();
      expect(screen.getByText('Exportar')).toBeInTheDocument();
    });

    it('debe renderizar la sección Reportes generados', () => {
      renderReportes();
      expect(screen.getByText('Reportes generados')).toBeInTheDocument();
    });

    it('debe renderizar las gráficas', () => {
      renderReportes();
      expect(screen.getAllByText('Citas por especialidad').length).toBeGreaterThan(0);
      expect(screen.getByText('Actividad semanal')).toBeInTheDocument();
    });

  });

  describe('Filtros', () => {

    it('debe limpiar los filtros al hacer clic en Limpiar filtros', async () => {
      renderReportes();
      const selects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selects[1], 'confirmada');
      await userEvent.click(screen.getByText('Limpiar filtros'));
      expect(selects[1].value).toBe('');
    });

    it('debe cambiar el filtro de estado al seleccionar', async () => {
      renderReportes();
      const selects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selects[1], 'pendiente');
      expect(selects[1].value).toBe('pendiente');
    });

    it('debe cambiar el filtro de modalidad al seleccionar', async () => {
      renderReportes();
      const selects = screen.getAllByRole('combobox');
      await userEvent.selectOptions(selects[3], 'virtual');
      expect(selects[3].value).toBe('virtual');
    });

  });

  describe('Acciones', () => {

    it('debe mostrar alerta al generar reporte exitosamente', async () => {
      global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
      renderReportes();
      await userEvent.click(screen.getByText('Generar reporte'));
      await waitFor(() => expect(screen.getByText('Reporte generado')).toBeInTheDocument());
    });

    it('debe abrir el dropdown de exportar al hacer clic', async () => {
      renderReportes();
      await userEvent.click(screen.getByText('Exportar'));
      expect(screen.getByText('Exportar PDF')).toBeInTheDocument();
      expect(screen.getByText('Exportar Excel')).toBeInTheDocument();
    });

    it('debe mostrar alerta al programar reporte automático', async () => {
      renderReportes();
      const btns = screen.getAllByRole('button');
      const btn1 = btns.find(b => b.textContent.includes('Programar reporte'));
      await userEvent.click(btn1);
      await waitFor(() => expect(screen.getByText('Reporte programado')).toBeInTheDocument());
    });

    it('debe mostrar alerta al crear reporte personalizado', async () => {
      renderReportes();
      const btns2 = screen.getAllByRole('button');
      const btn2 = btns2.find(b => b.textContent.includes('Crear reporte'));
      await userEvent.click(btn2);
      await waitFor(() => expect(screen.getByText('Próximamente')).toBeInTheDocument());
    });

  });

  describe('Integración con el backend', () => {

    it('debe llamar al endpoint de citas al generar reporte', async () => {
      renderReportes();
      await userEvent.click(screen.getByText('Generar reporte'));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/citas',
          expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
        );
      });
    });

    it('debe mostrar alerta de error si el backend falla', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderReportes();
      await userEvent.click(screen.getByText('Generar reporte'));
      await waitFor(() => expect(screen.getByText('Error de conexión')).toBeInTheDocument());
    });

  });

});