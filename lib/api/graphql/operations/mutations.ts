/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      profilePicture
      displayName
      stripeCustomerId
      subscriptionStatus
    }
  }
`;
export const createRecipe = /* GraphQL */ `
  mutation CreateRecipe($input: RecipeCreateInput!) {
    createRecipe(input: $input) {
      id
      coverImage
      title
      description
      servings
      owner
      ingredientsText
      stepsText
    }
  }
`;
export const updateRecipe = /* GraphQL */ `
  mutation UpdateRecipe($input: RecipeUpdateInput!) {
    updateRecipe(input: $input) {
      id
      coverImage
      title
      description
      servings
      owner
      ingredientsText
      stepsText
    }
  }
`;
export const deleteRecipe = /* GraphQL */ `
  mutation DeleteRecipe($id: String!) {
    deleteRecipe(id: $id) {
      id
      coverImage
      title
      description
      servings
      owner
      ingredientsText
      stepsText
    }
  }
`;
