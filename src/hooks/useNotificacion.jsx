import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Alert } from '@material-tailwind/react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const useNotificacion = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("success");
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, []);

  const mostrarNotificacion = useCallback((tipo, mensajeAlerta, duracion = 5000) => {
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTipoAlerta(tipo);
    setMensajeAlerta(mensajeAlerta);
    setMostrarAlerta(true);

    timeoutRef.current = setTimeout(() => {
      setMostrarAlerta(false);
      timeoutRef.current = null;
    }, duracion)

  }, []);

  const componenteAlerta = useMemo(() => {
    if (!mostrarAlerta) return null;
    const isSuccess = tipoAlerta === "success";
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (

    <div className="fixed top-4 right-4 z-[99999] animate-in slide-in-from-right duration-300">
      <Alert
        color={isSuccess ? "green" : "red"}
        icon={<Icon className='h-4 w-4 mt-1'/> }
        className="shadow-lg"
      >
        {mensajeAlerta}
      </Alert>
    </div>

    )
  }, [mostrarAlerta, tipoAlerta, mensajeAlerta])
  return { mostrarNotificacion, componenteAlerta };
}