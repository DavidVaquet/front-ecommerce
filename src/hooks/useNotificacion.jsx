import { useState } from 'react';
import { Alert } from '@material-tailwind/react';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const useNotificacion = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState("success");
  const [mensajeAlerta, setMensajeAlerta] = useState("");

  const mostrarNotificacion = (tipo, mensaje) => {
    setTipoAlerta(tipo);
    setMensajeAlerta(mensaje);
    setMostrarAlerta(true);
    setTimeout(() => setMostrarAlerta(false), 3000);
  };

  const componenteAlerta = mostrarAlerta && (
    <div className="fixed top-4 right-4 z-[99999] animate-in slide-in-from-right duration-300">
      <Alert
        color={tipoAlerta === "success" ? "green" : "red"}
        icon={
          tipoAlerta === "success" ? (
            <CheckCircle className="h-4 w-4 mt-1" />
          ) : (
            <AlertCircle className="h-4 w-4 mt-1" />
          )
        }
        className="shadow-lg"
      >
        {mensajeAlerta}
      </Alert>
    </div>
  );

  return {
    mostrarNotificacion,
    componenteAlerta
  }
}