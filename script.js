document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const message = document.getElementById('message');
    const confettiCanvas = document.getElementById('confetti');

    // Initial position state tracking
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        const rect = noBtn.getBoundingClientRect();
        // Calculate center of button
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        // Vector from mouse to button center
        const deltaX = btnCenterX - e.clientX;
        const deltaY = btnCenterY - e.clientY;
        const distance = Math.hypot(deltaX, deltaY);
        
        // Threshold within which the button starts running away
        const threshold = 150; 

        if (distance < threshold) {
            // Calculate repulsion force (inverse square law-ish for stronger effect when closer)
            const force = (threshold - distance) / distance;
            
            // Move button away from cursor
            const moveX = deltaX * force * 0.8; 
            const moveY = deltaY * force * 0.8;

            // Only update position if it keeps the button on screen
            const newX = currentX + moveX;
            const newY = currentY + moveY;
            
            // Check projected screen position using current rect + movement
            // rect.left is current screen X. moveX is change.
            const newLeft = rect.left + moveX;
            const newTop = rect.top + moveY;
            
            // Allow movement only if within bounds (with 10px padding)
            if (newLeft > 10 && newLeft + rect.width < window.innerWidth - 10) {
                currentX = newX;
            }
            if (newTop > 10 && newTop + rect.height < window.innerHeight - 10) {
                currentY = newY;
            }
            
            noBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    });

    // Keep it on screen (bounces back if too far)
    setInterval(() => {
        const rect = noBtn.getBoundingClientRect();
        const width = window.innerWidth;
        const height = window.innerHeight;
        const margin = 20;

        // Simple boundary checks to push it back
        if (rect.left < margin) currentX += 5;
        if (rect.right > width - margin) currentX -= 5;
        if (rect.top < margin) currentY += 5;
        if (rect.bottom > height - margin) currentY -= 5;
        
        noBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;

    }, 50);

    noBtn.addEventListener('click', (e) => {
        // Just in case it gets clicked
        e.preventDefault();
        alert('Nice try! But you have to say Yes! 😉');
    });

    // Yes Button Click - Confetti & Message
    yesBtn.addEventListener('click', () => {
        // Hide buttons container and heading
        document.querySelector('.buttons').style.display = 'none';
        document.querySelector('.main-heading').style.display = 'none';
        
        // Show message with larger style
        message.classList.remove('hidden');
        message.classList.add('success-message');
        
        message.innerHTML = `
            <h2>Yayyy! ❤️</h2>
            <p>I knew you'd handle the pressure 😉. Love you!</p>
        `;

        // Change background image
        document.body.style.backgroundImage = "url('pictures/img1.JPG')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        // Play Audio
        const audio = document.getElementById('loveSong');
        if (audio) {
            audio.volume = 1.0;
            audio.play().catch(e => console.log("Audio play failed:", e));
        }

        // Start Confetti
        startConfetti();
    });

    // Simple Confetti Implementation
    function startConfetti() {
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 150;
        const colors = ['#ff4d6d', '#ff004f', '#ffd166', '#06d6a0', '#118ab2'];

        class Particle {
            constructor() {
                this.x = Math.random() * confettiCanvas.width;
                this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
                this.size = Math.random() * 5 + 2;
                this.speedY = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.angle = Math.random() * 360;
                this.spin = Math.random() < 0.5 ? 1 : -1;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.angle += this.spin;

                if (this.y > confettiCanvas.height) {
                    this.y = -10;
                    this.x = Math.random() * confettiCanvas.width;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        animate();

        // Stop after 5 seconds
        setTimeout(() => {
            // Optional: stop animation or let it run
            // confettiCanvas.style.display = 'none'; 
        }, 5000);
    }
});
