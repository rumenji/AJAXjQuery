"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);

// !!! Show submit new story form
function submitClick(evt) {
  hidePageComponents();
  $storyForm.show();
  $allStoriesList.show();
}
$navSubmit.on("click", submitClick);

// !!! Show favorite stories only
function favoritesClick(evt) {
  hidePageComponents();
  putFavoritesOnPage();
}
$navFavorites.on("click", favoritesClick);

// !!! Show user stories only
function myStoriesClick(evt) {
  hidePageComponents();
  putOwnStoriesOnPage();
}
$navMyStories.on("click", myStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $userMenu.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


