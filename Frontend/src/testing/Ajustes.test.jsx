// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Ajustes from '../pages/Ajustes';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockActualizarUsuario = vi.fn();
const mockLogout = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    token: 'fake-token',
    nombreCompleto: 'Juan Pérez',
    iniciales: 'JP',
    usuario: { nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com', telefono: '3001234567', rol: 'paciente' },
    actualizarUsuario: mockActualizarUsuario,
    logout: mockLogout,
  }),
}));

vi.mock('../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

global.fetch = vi.fn();

const renderAjustes = () => render(
  <MemoryRouter>
    <Ajustes />
  </MemoryRouter>
);

describe('Componente Ajustes - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Ajustes de cuenta', () => {
      renderAjustes();
      expect(screen.getByRole('heading', { name: 'Ajustes de cuenta' })).toBeInTheDocument();
    });

    it('debe renderizar el subtítulo', () => {
      renderAjustes();
      expect(screen.getByText('Administra tu perfil, seguridad y preferencias de la aplicación.')).toBeInTheDocument();
    });

    it('debe renderizar la sección Información personal', () => {
      renderAjustes();
      expect(screen.getByText('Información personal')).toBeInTheDocument();
    });

    it('debe renderizar la sección Seguridad', () => {
      renderAjustes();
      expect(screen.getByText('Seguridad')).toBeInTheDocument();
    });

    it('debe renderizar la sección Preferencias de notificaciones', () => {
      renderAjustes();
      expect(screen.getByText('Preferencias de notificaciones')).toBeInTheDocument();
    });

    it('debe renderizar el campo de nombres', () => {
      renderAjustes();
      expect(screen.getByPlaceholderText('Tu nombre')).toBeInTheDocument();
    });

    it('debe renderizar el campo de correo', () => {
      renderAjustes();
      expect(screen.getByPlaceholderText('tu@correo.com')).toBeInTheDocument();
    });

    it('debe renderizar el campo de contraseña actual', () => {
      renderAjustes();
      expect(screen.getByPlaceholderText('Contraseña actual')).toBeInTheDocument();
    });

    it('debe renderizar el campo de nueva contraseña', () => {
      renderAjustes();
      expect(screen.getByPlaceholderText('Nueva contraseña')).toBeInTheDocument();
    });

    it('debe renderizar los botones de guardar', () => {
      renderAjustes();
      const btns = screen.getAllByText('Guardar cambios');
      expect(btns.length).toBeGreaterThan(0);
    });

    it('debe renderizar las iniciales del usuario', () => {
      renderAjustes();
      expect(screen.getAllByText('JP').length).toBeGreaterThan(0);
    });

  });

  describe('Formulario de perfil', () => {

    it('debe mostrar el nombre del usuario en el campo', () => {
      renderAjustes();
      expect(screen.getByPlaceholderText('Tu nombre').value).toBe('Juan');
    });

    it('debe actualizar el campo de nombres al escribir', async () => {
      renderAjustes();
      const input = screen.getByPlaceholderText('Tu nombre');
      await userEvent.clear(input);
      await userEvent.type(input, 'Pedro');
      expect(input.value).toBe('Pedro');
    });

    it('debe llamar actualizarUsuario al guardar perfil', async () => {
      renderAjustes();
      await userEvent.click(screen.getAllByText('Guardar cambios')[0]);
      expect(mockActualizarUsuario).toHaveBeenCalled();
    });

    it('debe mostrar alerta de éxito al guardar perfil', async () => {
      renderAjustes();
      await userEvent.click(screen.getAllByText('Guardar cambios')[0]);
      await waitFor(() => expect(screen.getByText('¡Cambios guardados!')).toBeInTheDocument());
    });

  });

  describe('Cambio de contraseña', () => {

    it('debe actualizar el campo de contraseña actual al escribir', async () => {
      renderAjustes();
      const input = screen.getByPlaceholderText('Contraseña actual');
      await userEvent.type(input, '123456');
      expect(input.value).toBe('123456');
    });

    it('debe mostrar alerta de error si las contraseñas no coinciden', async () => {
      renderAjustes();
      await userEvent.type(screen.getByPlaceholderText('Contraseña actual'), '123456');
      await userEvent.type(screen.getByPlaceholderText('Nueva contraseña'), 'nueva123');
      await userEvent.type(screen.getByPlaceholderText('Confirma tu contraseña'), 'diferente');
      await userEvent.click(screen.getByText('Actualizar contraseña'));
      await waitFor(() => expect(screen.getByText('No coinciden')).toBeInTheDocument());
    });

    it('debe llamar al endpoint de login para verificar contraseña actual', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'tok' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
      renderAjustes();
      await userEvent.type(screen.getByPlaceholderText('Contraseña actual'), '123456');
      await userEvent.type(screen.getByPlaceholderText('Nueva contraseña'), 'nueva123');
      await userEvent.type(screen.getByPlaceholderText('Confirma tu contraseña'), 'nueva123');
      await userEvent.click(screen.getByText('Actualizar contraseña'));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/login',
          expect.objectContaining({ method: 'POST' })
        );
      });
    });

  });

  describe('Preferencias', () => {

    it('debe renderizar los toggles de preferencias', () => {
      renderAjustes();
      expect(screen.getByText('Recordatorios de citas')).toBeInTheDocument();
    });

  });

});