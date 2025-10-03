import React, {memo} from 'react';
import { Card, CardBody, Typography, Progress } from "@material-tailwind/react";

const StatsCard = memo(function StatsCard({
  titulo,
  valor,
  icono,
  progreso,
  progresoTexto,
  colorProgreso,
  colorTyppography
}){

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
              <div className="h-12 w-12 rounded-full bg-deep-orange-50 flex items-center justify-center">
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