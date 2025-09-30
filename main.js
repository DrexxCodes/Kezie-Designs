 class ImageGallery {
            constructor() {
                this.slides = document.querySelectorAll('.image-slide');
                this.currentIndex = 0;
                this.isPlaying = true;
                this.slideInterval = null;
                this.slideDuration = 4000; // 4 seconds
                this.progressInterval = null;
                this.loadingOverlay = document.querySelector('.loading-overlay');
                this.playPauseBtn = document.getElementById('play-pause-btn');
                this.progressFill = document.getElementById('progress-fill');
                this.currentImageSpan = document.getElementById('current-image');
                this.totalImagesSpan = document.getElementById('total-images');
                
                this.init();
            }

            init() {
                // Shuffle images on load
                this.shuffleImages();
                
                // Wait for images to load
                this.loadImages().then(() => {
                    this.hideLoading();
                    this.showImage(0);
                    this.startSlideshow();
                    this.updateCounter();
                });

                // Add keyboard navigation
                document.addEventListener('keydown', (e) => {
                    switch(e.key) {
                        case 'ArrowLeft':
                            this.previousImage();
                            break;
                        case 'ArrowRight':
                            this.nextImage();
                            break;
                        case ' ':
                            e.preventDefault();
                            this.togglePlayPause();
                            break;
                    }
                });
            }

            async loadImages() {
                const imagePromises = Array.from(this.slides).map(slide => {
                    const img = slide.querySelector('img');
                    return new Promise((resolve, reject) => {
                        if (img.complete) {
                            resolve();
                        } else {
                            img.onload = resolve;
                            img.onerror = reject;
                        }
                    });
                });

                try {
                    await Promise.all(imagePromises);
                } catch (error) {
                    console.warn('Some images failed to load:', error);
                }
            }

            hideLoading() {
                this.loadingOverlay.classList.remove('active');
            }

            shuffleImages() {
                const container = document.querySelector('.image-container');
                const slidesArray = Array.from(this.slides);
                
                // Fisher-Yates shuffle algorithm
                for (let i = slidesArray.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [slidesArray[i], slidesArray[j]] = [slidesArray[j], slidesArray[i]];
                }
                
                // Re-append shuffled slides
                slidesArray.forEach(slide => container.appendChild(slide));
                
                // Update slides reference
                this.slides = document.querySelectorAll('.image-slide');
            }

            showImage(index) {
                // Remove all active classes
                this.slides.forEach((slide, i) => {
                    slide.classList.remove('active', 'prev', 'next');
                    
                    if (i === index) {
                        slide.classList.add('active');
                    } else if (i === (index - 1 + this.slides.length) % this.slides.length) {
                        slide.classList.add('prev');
                    } else if (i === (index + 1) % this.slides.length) {
                        slide.classList.add('next');
                    }
                });
                
                this.currentIndex = index;
                this.updateCounter();
            }

            nextImage() {
                const nextIndex = (this.currentIndex + 1) % this.slides.length;
                this.showImage(nextIndex);
                this.restartProgress();
            }

            previousImage() {
                const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
                this.showImage(prevIndex);
                this.restartProgress();
            }

            togglePlayPause() {
                this.isPlaying = !this.isPlaying;
                
                if (this.isPlaying) {
                    this.playPauseBtn.textContent = '⏸';
                    this.startSlideshow();
                } else {
                    this.playPauseBtn.textContent = '▶';
                    this.stopSlideshow();
                }
            }

            startSlideshow() {
                if (!this.isPlaying) return;
                
                this.stopSlideshow();
                this.startProgress();
                
                this.slideInterval = setInterval(() => {
                    this.nextImage();
                }, this.slideDuration);
            }

            stopSlideshow() {
                if (this.slideInterval) {
                    clearInterval(this.slideInterval);
                    this.slideInterval = null;
                }
                this.stopProgress();
            }

            startProgress() {
                this.stopProgress();
                this.progressFill.style.width = '0%';
                
                let progress = 0;
                const increment = 100 / (this.slideDuration / 50); // Update every 50ms
                
                this.progressInterval = setInterval(() => {
                    progress += increment;
                    this.progressFill.style.width = progress + '%';
                    
                    if (progress >= 100) {
                        this.stopProgress();
                    }
                }, 50);
            }

            stopProgress() {
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                    this.progressInterval = null;
                }
            }

            restartProgress() {
                if (this.isPlaying) {
                    this.startProgress();
                }
            }

            shuffle() {
                this.stopSlideshow();
                this.shuffleImages();
                this.showImage(0);
                if (this.isPlaying) {
                    this.startSlideshow();
                }
            }

            updateCounter() {
                this.currentImageSpan.textContent = this.currentIndex + 1;
                this.totalImagesSpan.textContent = this.slides.length;
            }
        }

        // WhatsApp button click handler
        function handleWhatsAppClick() {
            const popup = document.getElementById('message-popup');
            const overlay = document.getElementById('popup-overlay');
            
            // Show popup
            popup.classList.add('show');
            overlay.classList.add('show');
            
            // Hide popup and redirect after 3.5 seconds
            setTimeout(() => {
                popup.classList.remove('show');
                overlay.classList.remove('show');
                
                // Redirect to WhatsApp
                window.open('https://wa.me/+2348123927685', '_blank');
            }, 3500);
        }

        // Initialize gallery when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            window.gallery = new ImageGallery();
        });