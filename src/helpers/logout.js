export const logout = (navigate, setUser) => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
}