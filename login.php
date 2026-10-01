<?php
require 'config/auth.php';
require 'config/db.php';
require 'config/csrf.php';
require 'config/functions.php';
require 'config/rate_limit.php';
require_guest();

$error_message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!rate_limit_allow('login', 5, 300)) {
        $error_message = "Too many attempts. Try again in a few minutes.";
    } elseif (!csrf_verify($_POST['csrf_token'] ?? null)) {
        $error_message = "Invalid session. Please try again.";
    } else {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            rate_limit_reset('login');
            session_regenerate_id(true);
            $_SESSION['user_id']  = $user['user_id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role']     = $user['role'];
            header("Location: home.php");
            exit;
        } else {
            $error_message = "Invalid email or password.";
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login – Alight Creators</title>
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg" />
  <link rel="stylesheet" href="assets/css/styles.css?v=<?= css_version(); ?>" />
</head>
<body>
  <div class="app">
    <?php include 'includes/topnav.php'; ?>

    <main>
      <div class="hero-glow-bg"></div>

      <div class="auth-container">
        <div class="auth-hero">
          <h1>Welcome Back</h1>
          <p>Log in to access your saved tutorials.</p>
        </div>

        <?php if ($error_message): ?>
          <div class="toast toast-static toast-error show">
            <?= safe($error_message) ?>
          </div>
        <?php endif; ?>

        <div class="auth-card">
          <form method="POST" action="login.php" id="login-form">
            <?= csrf_field() ?>

            <div class="field field-mb-lg">
              <label for="email">Email</label>
              <input id="email"
                     name="email"
                     type="email"
                     required
                     placeholder="juandelacruz@example.com"
                     maxlength="100"
                     autocomplete="email" />
            </div>

            <div class="field field-mb-xl">
              <label for="password">Password</label>
              <input id="password"
                     name="password"
                     type="password"
                     required
                     placeholder="••••••••"
                     autocomplete="current-password" />
              <a href="forgot-password.php" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="btn-primary btn-full">Log In</button>
          </form>

          <div class="auth-footer">
            Don't have an account? <a href="register.php">Sign up here</a>
          </div>
        </div>
      </div>
    </main>

    <script src="assets/js/script.js"></script>
  </div><!-- /.app -->
</body>
</html>