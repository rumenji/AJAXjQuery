"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
// !!! Changed to refelect the star and trash icons depending on if the story is in the user's favorites or own stories
function generateStoryMarkup(story) {
  let deleteIcon = '';
  let favoriteIcon = '';
  const hostName = '';
  if (currentUser){
    if(currentUser.ownStories.find(s => s.storyId === story.storyId)){
      deleteIcon = '<span class="delete"><i class="fas fa-trash-alt"></i></span>';
    } 
    if (currentUser.favorites.find(s => s.storyId === story.storyId)){
      favoriteIcon = '<span class="favorite"><i class="fas fa-star"></i></span>'
    } else if (!currentUser.favorites.find(s => s.storyId === story.storyId)){
      favoriteIcon = '<span class="favorite"><i class="far fa-star"></i></span>'
    }
  }
    
  return `
  <li id="${story.storyId}">
    ${deleteIcon}
    ${favoriteIcon}
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small><br>
    <small class="story-author">by ${story.author}</small><br>
    <small class="story-user">posted by ${story.username}</small>
  </li>
  <hr>
`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// !!! Add new story after story form is submit
async function submitStoryForm(evt){
  evt.preventDefault();

  // grab the form values
  const title = $("#title").val();
  const author = $("#author").val();
  const url = $("#url").val();

  $storyForm.trigger("reset");
  $storyForm.hide();

// !!! Call the addStory method with the values from the form
  const story = await storyList.addStory(currentUser, {title, author, url});
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story)
  $ownStoriesList.prepend($story)

}

$storyForm.on("submit", submitStoryForm);

// !!! Favorite story
async function favoriteStory(evt) {
  evt.preventDefault();
  const $targetElement = $(evt.target);
  const story = storyList.stories.find(s => s.storyId === evt.target.parentElement.parentElement.id);
  // Call storeFavorites User method by story - if already a favorite - remove it
  const favoriteState = await currentUser.storeFavorites(story)
  $targetElement.toggleClass('fas far');
}
$storiesLists.on("click", ".favorite", favoriteStory);

// !!! Delete Story when user clicks on the trash can icon
async function deleteStory(evt) {
  evt.preventDefault();
  await storyList.removeStory(currentUser, evt.target.parentElement.parentElement.id)
  await putOwnStoriesOnPage();
}

$storiesLists.on("click", ".delete", deleteStory);

// !!! Instead of adding separate divs - created two functions to filter stories depending on the menu clicked
function putOwnStoriesOnPage() {
  $ownStoriesList.empty();
  for(let story of currentUser.ownStories){
    const $story = generateStoryMarkup(story);
    $ownStoriesList.append($story);
  }
  $ownStoriesList.show();
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoritedStoriesList.empty();
  for(let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $favoritedStoriesList.append($story);
  }
  $favoritedStoriesList.show();
}

async function setFavorited(evt){
  
}
