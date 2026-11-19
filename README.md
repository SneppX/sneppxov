# SneppXOV

The public website for the SneppX organization.

It brings together public project repositories, project-specific documentation, developer resources, contribution guidance, and links to upstream commit history and releases.

## Live site

https://sneppx.github.io/sneppxov/

## Local preview

Run `python -m http.server 8000` from the repository root, then open http://localhost:8000.

## Implementation

The site uses plain HTML, CSS, and JavaScript. It does not require a frontend framework, remote font service, analytics service, or paid runtime. Theme preference is stored locally. Site search uses a local page index.

Project descriptions and links must be verified against upstream repositories. Do not add unsupported metrics, claims, screenshots, or release information.

## Quality checks

`node --test tests/*.test.js`

`python scripts/validate_catalog.py --core ../sneppx-alg`

## License

MIT
