"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

// !!! Add new story after story form is submit
function submitStoryForm(evt){
    evt.preventDefault();
  
    // grab the form values
    const title = $("#title").val();
    const author = $("#author").val();
    const url = $("#url").val();
  
    $storyForm.trigger("reset");
    $storyForm.hide();

  // !!! Call the addStory method with the values from the form
    storyList.addStory(currentUser, {title, author, url});
    // getAndShowStoriesOnStart();
    start();

  }
  
$storyForm.on("submit", submitStoryForm);

// !!! Favorite story
function favoriteStory(evt) {
  evt.preventDefault();
  // Call storeFavorites User method by story ID - if already a favorite - remove it
  currentUser.storeFavorites(evt.target.parentElement.parentElement.id)
}
$allStoriesList.on("click", ".favorite", favoriteStory);

// !!! Delete Story when user clicks on the trash can icon
function deleteStory(evt) {
  evt.preventDefault();
  currentUser.removeStory(evt.target.parentElement.parentElement.id)
}

$allStoriesList.on("click", ".delete", deleteStory);
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
  const hostName = story.getHostName();
  if (currentUser){
    if(currentUser.ownStories.find(s => s.storyId === story.storyId)){
      console.log(story)
      deleteIcon = '<span class="delete"><i class="fas fa-trash-alt"></i></span>';
    } 
    if (currentUser.favorites.find(s => s.storyId === story.storyId)){
      console.log(story)
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

// !!! Instead of adding separate divs - created two functions to filter stories depending on the menu clicked
function putOwnStoriesOnPage() {
  $allStoriesList.empty();
  for(let story of currentUser.ownStories){
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  } 
}

function putFavoritesOnPage() {
  $allStoriesList.empty();
  for(let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  } 
}
