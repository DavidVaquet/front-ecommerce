import { Button } from "@material-tailwind/react";

function ButtonResponsive ({ children, icon: Icon, ...props}) {

    return ( 
        <Button
        {...props}
        className={`
        flex items-center gap-2 uppercase
        px-3 py-2.5 text-xs
        md:py-2 md:px-4 md:text-sm`}>
        {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6"/>}
            {children}
        </Button>
    );
}

export default ButtonResponsive;