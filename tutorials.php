<?php
require 'config/auth.php';
require 'config/db.php';
require 'config/functions.php';
require_login();

$current_category = $_GET['category'] ?? 'All';

/* Whitelist so bogus query strings don't produce empty pages */
$allowed_categories = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Tips & Tricks'];
if (!in_array($current_category, $allowed_categories, true)) {
    $current_category = 'All';
}

$header_title = "All Tutorials";
$header_desc  = "Browse our entire library of motion design guides.";

if ($current_category === 'Beginner') {
    $header_title = "Beginner Tutorials";
    $header_desc  = "Start your motion design journey with these fundamental guides.";
} elseif ($current_category === 'Intermediate') {
    $header_title = "Intermediate Tutorials";
    $header_desc  = "Level up your skills with more complex techniques and effects.";
} elseif ($current_category === 'Advanced') {
    $header_title = "Advanced Tutorials";
    $header_desc  = "Master Alight Motion with professional-grade workflows.";
} elseif ($current_category === 'Tips & Tricks') {
    $header_title = "Tips & Tricks";
    $header_desc  = "Quick hacks, shortcuts, and advice to speed up your editing.";
}

try {
    if ($current_category === 'All') {
        $stmt = $pdo->query("SELECT * FROM tutorials ORDER BY created_at DESC");
        $tutorials = $stmt->fetchAll();
    } else {
        $stmt = $pdo->prepare("SELECT * FROM tutorials WHERE category = ? ORDER BY created_at DESC");
        $stmt->execute([$current_category]);
        $tutorials = $stmt->fetchAll();
    }
} catch (PDOException $e) { $tutorials = []; }

/* Category list reused by both the mobile chip row and the desktop sidebar */
$category_list = [
    'All'           => 'All',
    'Beginner'      => 'Beginners',
    'Intermediate'  => 'Intermediate',
    'Advanced'      => 'Advanced',
    'Tips & Tricks' => 'Tips & Tricks',
];
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?= safe($header_title) ?> – Alight Creators</title>
  <meta name="description" content="<?= safe($header_desc) ?>" />
  <link rel="icon" type="image/svg+xml" href="assets/images/logo.svg" />
  <link rel="stylesheet" href="assets/css/styles.css?v=<?= css_version(); ?>" />
</head>
<body>
  <div class="app">
    <?php include 'includes/topnav.php'; ?>

    <main>
      <div class="hero-glow-bg"></div>

      <div class="tutorials-layout">

        <?php
          $sidebar_active_category = $current_category;
          include 'includes/sidebar-categories.php';
        ?>

        <section class="content page-content">

          <div class="page-header">
            <h1><?= safe($header_title) ?></h1>
            <p><?= safe($header_desc) ?></p>
          </div>

          <!-- ============ Mobile-only category chips ============ -->
          <nav class="mobile-category-chips" aria-label="Filter by category">
            <?php foreach ($category_list as $value => $label): ?>
              <a href="tutorials.php?category=<?= urlencode($value) ?>"
                 class="mobile-category-chip <?= $current_category === $value ? 'active' : '' ?>">
                <?= safe($label) ?>
              </a>
            <?php endforeach; ?>
          </nav>

          <div class="page-scroll-area">
            <div class="tutorials-grid">
              <?php if (count($tutorials) > 0): ?>
                <?php foreach ($tutorials as $tut): ?>
                  <a class="tutorial-card" href="tutorial-detail.php?id=<?= (int)$tut['tutorial_id'] ?>">
                    <div class="tutorial-thumb" style="<?= !empty($tut['thumbnail_path']) ? 'background-image:url(' . safe($tut['thumbnail_path']) . ');background-size:cover;background-position:center;' : '' ?>"></div>
                    <div class="tutorial-info">
                      <h3><?= safe($tut['title']) ?></h3>
                      <span class="badge <?= badge_for($tut['category']) ?>"><?= safe($tut['category']) ?></span>
                    </div>
                  </a>
                <?php endforeach; ?>
              <?php else: ?>
                <p class="text-muted">No tutorials found for this category yet!</p>
              <?php endif; ?>
            </div>

            <!-- ============ Mobile-only Popular Tutorials ============ -->
            <div class="mobile-popular-block">
              <?php
                $popular_exclude_id = null;
                include 'includes/popular-tutorials.php';
              ?>
            </div>
          </div>

        </section>

        <aside class="right-panel page-content">
          <?php include 'includes/popular-tutorials.php'; ?>
        </aside>
      </div>
    </main>

    <script src="assets/js/script.js"></script>
  </div><!-- /.app -->
</body>
</html>