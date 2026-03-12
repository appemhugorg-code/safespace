import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            {/* House */}
            <path d="M24 4L6 18V44H18V32H30V44H42V18L24 4Z" fill="currentColor" opacity="0.9"/>
            {/* Heart */}
            <path d="M24 28C24 28 18 24 18 20C18 17 20 16 22 16C23.5 16 24 17 24 17C24 17 24.5 16 26 16C28 16 30 17 30 20C30 24 24 28 24 28Z" fill="currentColor"/>
        </svg>
    );
}
