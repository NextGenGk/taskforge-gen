
# Deploying to Netlify

This project is configured to be deployed on Netlify. Follow these steps to deploy:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up or log in to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Select your Git provider and repository
5. Netlify will automatically detect the build settings from the netlify.toml file
6. Click "Deploy site"

## Environment Variables

If needed, set these environment variables in the Netlify dashboard under Site settings > Build & deploy > Environment:

- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Troubleshooting

- If you encounter build errors, check the Netlify logs
- Make sure all environment variables are properly set
- For routing issues, the netlify.toml file includes redirects for SPA routing
