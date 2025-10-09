import React, {memo} from 'react';
import { Card, CardBody, Typography, Progress } from "@material-tailwind/react";

const bgColorMap = {
  'green-50': 'bg-green-50',
  'blue-50': 'bg-blue-50',
  'yellow-50': 'bg-yellow-50',
  'deep-orange-50': 'bg-deep-orange-50',
  'gray-50': 'bg-gray-50',
  'red-50': 'bg-red-50'
};

const StatsCard = memo(function StatsCard({
  titulo,
  valor,
  icono,
  progreso,
  progresoTexto,
  colorProgreso,
  colorTyppography,
  iconoBackground
}){

  const bgClass = bgColorMap[iconoBackground] ?? 'bg-gray-50';

  return (
    <Card className="shadow-sm border border-gray-200">
          <CardBody className="p-4">
            <div className="flex justify-between">
              <div>
                <Typography
                  variant="small"
                  color={colorTyppography}
                  className="font-medium mb-1"
                >
                  {titulo}
                </Typography>
                <Typography
                  variant="h3"
                  color={colorTyppography}
                  className="font-bold"
                >
                  {valor}
                </Typography>
              </div>
              {icono ? (
              <div className={`h-12 w-12 rounded-full bg-${iconoBackground} flex items-center justify-center`}>
                {icono}
              </div>

              ) : null }
            </div>
            
            { typeof progreso === 'number' && (
              <div className='mt-3'>
                {progresoTexto && (
                  <div className='flex justify-between mb-1'>
                    <Typography variant="small" color={colorTyppography} className="font-medium">
                      {progresoTexto}
                    </Typography>
                  </div>
                )}
                <Progress value={progreso} color={colorProgreso}/>
              </div>
            )} 
          </CardBody>
        </Card>
  )
}) 

export default StatsCard;