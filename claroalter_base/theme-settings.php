<?php

/**
 * @file
 * Functions to support Claro Alter theme settings.
 */

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_FORM_ID_alter() for system_theme_settings.
 */
function claro_alter_form_system_theme_settings_alter(&$form, FormStateInterface $form_state) {

  $form['claro_alter_settings']['claro_alter_color_scheme'] = [
    '#type' => 'fieldset',
    '#title' => t('Primary Highlight Color Settings'),
  ];

  $form['claro_alter_settings']['claro_alter_color_scheme']['description'] = [
    '#type' => 'html_tag',
    '#tag' => 'p',
    '#value' => t('These settings adjust the primamry highlight color for the Claro Alter theme.'),
  ];

  $form['claro_alter_settings']['claro_alter_color_scheme']['color'] = [
    '#type' => 'textfield',
    '#maxlength' => 7,
    '#size' => 10,
    '#title' => t('Primary Highlight Color'),
    '#description' => t('Enter color in full hexadecimal format (#abc123).'),
    '#default_value' => theme_get_setting('color'),
    '#attributes' => [
      'pattern' => '^#[a-fA-F0-9]{6}',
    ],
  ];
}
