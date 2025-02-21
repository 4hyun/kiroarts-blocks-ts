<?php
function register_hjarts_navigation_cpt() {
    register_post_type('hjarts_navigation', array(
        'labels'        => array(
            'name'          => _x('HJArts Custom Navigations', 'hjarts custom navigation post type general name.'),
            'singular_name' => _x('HJArts Custom Navigation', 'hjarts custom navigation post type singular name. '),
        ),
        'public'        => true,
        'show_in_rest'  => true, // Enables REST API support
        'supports'      => array('title', 'editor'),
    ));
}
add_action('init', 'register_hjarts_navigation_cpt');

function save_hjarts_navigation_meta($post_id) {
    if (isset($_POST['navigationMenu'])) {
        update_post_meta($post_id, 'navigation_menu', json_encode($_POST['navigationMenu']));
    }
}
add_action('save_post_hjarts_navigation', 'save_hjarts_navigation_meta');
