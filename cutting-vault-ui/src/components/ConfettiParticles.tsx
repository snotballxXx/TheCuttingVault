// ParticlesBackground.tsx
import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { type ISourceOptions } from '@tsparticles/engine';
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
import { loadFull } from 'tsparticles'; // if you are going to use `loadFull`, install the "tsparticles" package too.
//import { loadSlim } from '@tsparticles/slim'; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const ConfettiParticles = () => {
    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (): Promise<void> => {};

    const options: ISourceOptions = useMemo(
        () => ({
            fullScreen: {
                enable: true, // Enable fullscreen mode for the particle canvas
            },
            emitters: {
                life: {
                    count: 1, // Emit once
                    duration: 0.2, // Short-lived burst
                },
                position: {
                    x: 50, // 50% of the canvas width
                    y: 50, // 50% of the canvas height
                },
                rate: {
                    quantity: 100, // Number of particles emitted
                    delay: 0, // Emit instantly
                },
                size: {
                    width: 0,
                    height: 0,
                },
            },
            particles: {
                number: {
                    value: 0, // Particles are emitted only when triggered
                },
                color: {
                    value: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'], // Confetti colors
                },
                shape: {
                    type: 'square', // Shape of the confetti particles
                },
                opacity: {
                    value: 1, // Fully visible particles
                },
                size: {
                    value: { min: 3, max: 8 }, // Random sizes for particles
                },
                move: {
                    enable: true,
                    speed: { min: 10, max: 50 }, // Random speeds
                    direction: 'none', // Move particles in random directions
                    outModes: {
                        default: 'destroy', // Destroy particles when they leave the canvas
                    },
                },
            },
        }),
        [],
    );

    if (init) {
        return (
            <Particles
                id="tsparticles2"
                particlesLoaded={particlesLoaded}
                options={options}
            />
        );
    }

    return <></>;
};

export default ConfettiParticles;
