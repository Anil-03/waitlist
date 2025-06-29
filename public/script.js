document.getElementById('waitlist-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const messageDiv = document.getElementById('message');
  try {
    const res = await fetch('https://mysql-production-9ae3.up.railway.app/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await res.json();
    if (res.ok) {
      messageDiv.textContent = data.message || 'Thank you for joining the waitlist!';
      messageDiv.style.color = 'green';
      document.getElementById('waitlist-form').reset();
    } else {
      messageDiv.textContent = data.message || 'There was an error. Please try again.';
      messageDiv.style.color = 'red';
      console.error('Server error:', data);
    }
  } catch (error) {
    console.error("Network error:", error);
    messageDiv.textContent = 'Network error. Please try again.';
    messageDiv.style.color = 'red';
  }
});
