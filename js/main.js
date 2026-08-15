

// Minimal JS for newsletter popup and form submission
        document.addEventListener('DOMContentLoaded', function() {
            var modal = document.getElementById('newsletter-modal');
            var btn = document.getElementById('newsletter-link');
            var span = document.getElementsByClassName('close')[0];
            var form = document.querySelector('.newsletter-form');
            var messageBox = document.getElementById('newsletter-message');

            function showNewsletterMessage(msg) {
                if (messageBox) {
                    messageBox.innerHTML = msg;
                    messageBox.style.display = 'block';
                }
            }
            function hideNewsletterMessage() {
                if (messageBox) {
                    messageBox.style.display = 'none';
                    messageBox.innerHTML = '';
                }
            }

            // Open via secondary nav link
            btn.onclick = function(e) {
                e.preventDefault();
                modal.style.display = 'block';
                hideNewsletterMessage();
            }

            span.onclick = function() {
                modal.style.display = 'none';
                hideNewsletterMessage();
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                    hideNewsletterMessage();
                }
            }

            // Handle newsletter form submission
            if (form) {
                form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    var name = form.elements['name'].value.trim();
                    var email = form.elements['email'].value.trim();
                    if (!name || !email) {
                        showNewsletterMessage('Udfyld både navn og email.');
                        return;
                    }
                    try {
                        const response = await fetch('https://api.detgunst.dk/emails', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, email })
                        });
                        if (response.ok) {
                            form.innerHTML = '<div style="padding:0.75rem 1rem; border-radius:0.5rem; color:black; font-weight:bold; text-align:center;">Tak for din tilmelding!</div>';
                            setTimeout(function() {
                                modal.style.display = 'none';
                                // Optionally, reset form HTML to original for next open
                                form.innerHTML = '<input type="text" name="name" placeholder="Dit navn" required>\n<input type="email" name="email" placeholder="Din email" required>\n<button type="submit">Tilmeld</button>';
                            }, 2000);
                        } else {
                            let errorMsg = 'Noget gik galt.';
                            try {
                                const data = await response.json();
                                if (data.error) errorMsg = data.error;
                            } catch (e) {}
                            const originalForm = '<input type="text" name="name" placeholder="Dit navn" required>\n<input type="email" name="email" placeholder="Din email" required>\n<button type="submit">Tilmeld</button>';
                            form.innerHTML = `<div style="padding:0.75rem 1rem; border-radius:0.5rem; color:black; font-weight:bold; text-align:center;">${errorMsg}</div>`;
                            setTimeout(function() {
                                form.innerHTML = originalForm;
                            }, 2000);
                        }
                    } catch (err) {
                        showNewsletterMessage('Kunne ikke tilmelde. Prøv igen senere.');
                    }
                });
            }
        });
  document.body.addEventListener('htmx:afterSwap', function(evt) {
    // Only run on hard page load (when #content is empty)
    if (location.pathname !== '/' && 
        document.getElementById('content') && 
        !document.getElementById('content').innerHTML.trim()) {
      
      const map = {
        '/om': 'om.html',
        '/creativehub': 'creativehub.html'
      };
      const file = map[location.pathname] || 'home.html';
      htmx.ajax('GET', 'partials/' + file, {
        target: '#content',
        swap: 'innerHTML',
        pushUrl: location.pathname  // optional: ensure URL stays correct
      });
    }
  });