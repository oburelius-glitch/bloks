// Sayfa yüklendiğinde linkleri ve videoları sırayla anime et
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.link-card, .video-container, .section-title');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, (index + 1) * 150); // Gecikmeli giriş
            });
        });

        // IP Kopyalama Fonksiyonu
        function copyServerIP() {
            const ip = document.getElementById('ip-text').innerText;
            const toast = document.getElementById('toast');
            
            // Panoya kopyala
            const textArea = document.createElement("textarea");
            textArea.value = ip;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                // Bildirimi göster
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2500);
            } catch (err) {
                console.error('Kopyalama başarısız!', err);
            }
            document.body.removeChild(textArea);
        }

        // ==========================================
        // MINECRAFT LOW ANIMATION ARKA PLAN SİSTEMİ
        // ==========================================
        const canvas = document.getElementById('mc-background');
        const ctx = canvas.getContext('2d');

        let particlesArray = [];
        const colors = [
            'rgba(66, 245, 232, 0.15)', // Elmas
            'rgba(74, 222, 128, 0.15)', // Zümrüt
            'rgba(168, 85, 247, 0.15)', // Nether Geçidi / Büyü
            'rgba(255, 255, 255, 0.05)' // Bulut/Toz
        ];

        // Ekran boyutunu ayarla
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();

        // Minecraft Blok/Kare Partikül Sınıfı
        class BlockParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height + canvas.height; // Ekranın altından başla
                this.size = Math.random() * 25 + 10; // Boyut
                this.speedY = Math.random() * 0.8 + 0.2; // Çok yavaş ve akıcı hareket (Low animasyon)
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 0.5;
            }

            update() {
                this.y -= this.speedY; // Yukarı doğru süzülme
                this.rotation += this.rotationSpeed; // Kendi etrafında yavaşça dönme

                // Ekranın en üstünden çıkarsa alta tekrar gönder
                if (this.y < -50) {
                    this.y = canvas.height + 50;
                    this.x = Math.random() * canvas.width;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                
                // Minecraft hissi için kare/küp çizimi
                ctx.fillStyle = this.color;
                ctx.strokeStyle = this.color.replace('0.15', '0.3').replace('0.05', '0.1'); // Kenarlık biraz daha belirgin
                ctx.lineWidth = 1;
                
                // Kare çiz
                ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
                
                ctx.restore();
            }
        }

        // Partikülleri oluştur
        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 15000; // Ekrana göre yoğunluk
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new BlockParticle());
            }
        }

        // Animasyon Döngüsü
        function animateBackground() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateBackground);
        }

        // Başlat
        initParticles();
        animateBackground();

        // Ekran boyutu değiştiğinde partikülleri sıfırla
        window.addEventListener('resize', () => {
            initParticles();
        });