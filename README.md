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

## Code style

- Prettier formats HTML, CSS, JavaScript, JSON, Markdown, and GitHub Actions YAML; SVG assets use Prettier's HTML parser.
- Ruff formats and lints Python code.
- EditorConfig defines consistent UTF-8, LF line endings, final newlines, and indentation.
- Generated files, dependencies, and minified vendor assets are excluded from formatting.

## Quality checks

```sh
node --test tests/*.test.js
python scripts/validate_catalog.py --core ../sneppx-alg
npx prettier@3.6.2 --check "**/*.{html,css,js,json,md,yml,yaml}"
npx prettier@3.6.2 --check "**/*.svg" --parser html
ruff check scripts
ruff format --check scripts
```

## License

MIT
