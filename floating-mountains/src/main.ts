import './style.css';

// Mountain images from Seismic website
const mountain1Img = 'https://ext.same-assets.com/2675109532/3442963240.png'; // Main floating mountain
const mountain2Img = 'https://ext.same-assets.com/2675109532/3531562096.png'; // Additional mountain
const mountain3Img = 'https://ext.same-assets.com/2675109532/3407796143.png'; // Additional mountain

// Get mountain elements
const mountain1El = document.getElementById('mountain1') as HTMLElement;
const mountain2El = document.getElementById('mountain2') as HTMLElement;
const mountain3El = document.getElementById('mountain3') as HTMLElement;

// Set mountain images
if (mountain1El) mountain1El.innerHTML = `<img src="${mountain1Img}" alt="Floating mountain 1">`;
if (mountain2El) mountain2El.innerHTML = `<img src="${mountain2Img}" alt="Floating mountain 2">`;
if (mountain3El) mountain3El.innerHTML = `<img src="${mountain3Img}" alt="Floating mountain 3">`;

// Add parallax effect on mouse move
const mountainsContainer = document.querySelector('.mountains-container') as HTMLElement;

if (mountainsContainer) {
  // Handle mouse movement for parallax effect
  mountainsContainer.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = mountainsContainer.getBoundingClientRect();

    // Calculate mouse position relative to container center (values from -0.5 to 0.5)
    const xPos = (clientX - left) / width - 0.5;
    const yPos = (clientY - top) / height - 0.5;

    // Apply 3D transform based on mouse position
    if (mountain1El) {
      mountain1El.style.transform = `translateZ(50px) rotateX(${yPos * -10}deg) rotateY(${xPos * 10}deg) translateX(${xPos * 20}px) translateY(${yPos * 20}px)`;
    }

    if (mountain2El) {
      mountain2El.style.transform = `translateZ(-50px) rotateX(${yPos * -5}deg) rotateY(${xPos * 5}deg) translateX(${xPos * -30}px) translateY(${yPos * -10}px)`;
    }

    if (mountain3El) {
      mountain3El.style.transform = `translateZ(-30px) rotateX(${yPos * -3}deg) rotateY(${xPos * 3}deg) translateX(${xPos * 30}px) translateY(${yPos * -15}px)`;
    }
  });

  // Reset transform when mouse leaves container
  mountainsContainer.addEventListener('mouseleave', () => {
    if (mountain1El) mountain1El.style.transform = 'translateZ(50px)';
    if (mountain2El) mountain2El.style.transform = 'translateZ(-50px)';
    if (mountain3El) mountain3El.style.transform = 'translateZ(-30px)';
  });
}
