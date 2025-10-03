// src/services/printService.js
const CERTIFICATE = import.meta.env.REACT_APP_QZ_CERTIFICADO;
const PRIVATE_KEY = import.meta.env.REACT_APP_QZ_PRIVATE_KEY;

class PrintService {
  constructor() {
    this.connected = false;
    this.defaultPrinter = null;
    this.qz = null;
    this.qzReady = false;
  }

  // Esperar a que QZ esté completamente cargado
  async waitForQZ(timeout = 5000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (typeof window !== 'undefined' && 
          window.qz && 
          window.qz.websockets && 
          typeof window.qz.websockets.connect === 'function') {
        this.qz = window.qz;
        this.qzReady = true;
        console.log('✅ QZ Tray cargado correctamente');
        return true;
      }
      
      // Esperar 100ms antes de volver a intentar
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error('Timeout: QZ Tray no se cargó en el tiempo esperado');
  }

  setSecurity() {
    if (!this.qz) {
      throw new Error('QZ Tray no está inicializado');
    }

    this.qz.security.setCertificatePromise((resolve) => {
      resolve(CERTIFICATE);
    });

    this.qz.security.setSignatureAlgorithm("SHA512");
    
    this.qz.security.setSignaturePromise((toSign) => {
      return (resolve, reject) => {
        try {
          if (window.CryptoJS) {
            const hash = window.CryptoJS.SHA512(toSign + PRIVATE_KEY);
            resolve(hash.toString());
          } else {
            // Fallback: solo devolver el string original
            resolve(toSign);
          }
        } catch (err) {
          reject(err);
        }
      };
    });
  }

  async connect() {
    if (this.connected) return true;

    try {
      // Esperar a que QZ esté listo
      if (!this.qzReady) {
        console.log('Esperando a que QZ Tray se cargue...');
        await this.waitForQZ();
      }

      // Configurar seguridad
      this.setSecurity();
      
      // Verificar si ya está conectado
      let isActive = false;
      try {
        isActive = await this.qz.websockets.isActive();
      } catch (e) {
        isActive = false;
      }
      
      if (!isActive) {
        console.log('🔌 Conectando a QZ Tray...');
        await this.qz.websockets.connect();
        console.log('✅ Conectado a QZ Tray');
      } else {
        console.log('✅ Ya estaba conectado a QZ Tray');
      }
      
      this.connected = true;
      return true;
      
    } catch (error) {
      console.error('❌ Error conectando a QZ Tray:', error);
      
      // Mensajes de error más específicos
      if (error.message.includes('Timeout')) {
        throw new Error('QZ Tray no se cargó. Verifica que los scripts estén en index.html');
      } else if (error.message.includes('websocket') || error.message.includes('ECONNREFUSED')) {
        throw new Error('QZ Tray no está ejecutándose. Por favor, inicia la aplicación QZ Tray en tu computadora.');
      } else {
        throw new Error('Error al conectar: ' + error.message);
      }
    }
  }

  async disconnect() {
    if (!this.connected || !this.qz) return;
    
    try {
      const isActive = await this.qz.websockets.isActive();
      if (isActive) {
        await this.qz.websockets.disconnect();
      }
      this.connected = false;
      console.log('🔌 Desconectado de QZ Tray');
    } catch (error) {
      console.error('Error al desconectar:', error);
    }
  }

  async getPrinters() {
    await this.connect();
    const printers = await this.qz.printers.find();
    console.log('🖨️ Impresoras disponibles:', printers);
    return printers;
  }

  setDefaultPrinter(printerName) {
    this.defaultPrinter = printerName;
    localStorage.setItem('defaultPrinter', printerName);
    console.log('💾 Impresora guardada:', printerName);
  }

  getDefaultPrinter() {
    if (this.defaultPrinter) return this.defaultPrinter;
    return localStorage.getItem('defaultPrinter');
  }

  async imprimirEtiquetaZebra(producto) {
    await this.connect();

    const printerName = this.getDefaultPrinter();
    if (!printerName) {
      throw new Error('No hay impresora configurada. Ve a Configuración → Impresoras');
    }

    const config = this.qz.configs.create(printerName);

    const zpl = `
^XA
^CF0,30
^FO50,50^BY2
^BCN,100,Y,N,N
^FD${producto.codigoBarras}^FS
^FO50,170^A0N,25,25^FD${producto.nombre}^FS
^FO50,210^A0N,20,20^FDPrecio: $${producto.precio}^FS
^FO50,240^A0N,18,18^FDStock: ${producto.stock || 0}^FS
^XZ
    `;

    try {
      await this.qz.print(config, [zpl]);
      console.log('✅ Etiqueta impresa correctamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      throw error;
    }
  }

  async imprimirEtiquetaNormal(producto) {
    await this.connect();

    const printerName = this.getDefaultPrinter();
    if (!printerName) {
      throw new Error('No hay impresora configurada. Ve a Configuración → Impresoras');
    }

    const config = this.qz.configs.create(printerName);

    const html = `
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center;
            padding: 20px;
            width: 4in;
            height: 2in;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .producto { 
            font-size: 18px; 
            font-weight: bold; 
            margin: 10px 0;
            text-transform: uppercase;
          }
          .precio { 
            font-size: 24px; 
            font-weight: bold;
            color: #2563eb;
            margin: 10px 0; 
          }
          .codigo { 
            font-size: 12px; 
            color: #666;
            margin: 5px 0; 
          }
          .stock {
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="producto">${producto.nombre}</div>
        <div class="precio">$${producto.precio}</div>
        <div class="codigo">Código: ${producto.codigoBarras}</div>
        <div class="stock">Stock: ${producto.stock || 0}</div>
      </body>
      </html>
    `;

    try {
      await this.qz.print(config, [{
        type: 'html',
        format: 'plain',
        data: html
      }]);
      console.log('✅ Etiqueta impresa correctamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error al imprimir:', error);
      throw error;
    }
  }
}

export default new PrintService();