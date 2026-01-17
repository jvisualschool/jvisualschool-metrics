# JVisualSchool GitHub Metrics Page

이 프로젝트는 [lowlighter/metrics](https://github.com/lowlighter/metrics)를 사용하여 GitHub 활동을 시각화하고, 이를 멋진 웹페이지로 보여줍니다.

## 🚀 시작하기 (Getting Started)

### 1. GitHub 토큰 생성
Metrics 생성을 위해 GitHub Personal Access Token(PAT)이 필요합니다.
1. [GitHub Developer Settings](https://github.com/settings/tokens)로 이동합니다.
2. **Generate new token (classic)**을 선택합니다.
3. 다음 권한(Scope)을 체크합니다:
   - `public_repo` (공개 레포지토리만 접근 시) 또는 `repo` (비공개 포함 시)
   - `read:user`
   - `read:org`
4. 토큰 값을 복사해둡니다.

### 2. 레포지토리 설정
1. 이 폴더의 내용을 GitHub 레포지토리에 업로드합니다.
2. 레포지토리 **Settings** -> **Secrets and variables** -> **Actions**로 이동합니다.
3. **New repository secret**을 클릭합니다.
4. Name: `METRICS_TOKEN`
5. Secret: 아까 복사한 토큰 값을 입력합니다.

### 3. GitHub Actions 활성화
1. `.github/workflows/metrics.yml` 파일이 있는지 확인합니다.
2. 코드가 푸시되면 **Actions** 탭에서 `Metrics` 워크플로우가 자동으로 실행될 것입니다.
3. 실행이 완료되면 레포지토리 루트에 `github-metrics.svg` 파일이 생성됩니다.

### 4. GitHub Pages 배포
1. 레포지토리 **Settings** -> **Pages**로 이동합니다.
2. **Source**를 `Deploy from a branch`로 설정합니다.
3. **Branch**를 `main` (또는 master) / `/ (root)`로 설정하고 저장합니다.
4. 잠시 후 `https://<username>.github.io/<repo-name>` 주소에서 페이지를 확인할 수 있습니다.

## 🎨 커스터마이징
- **디자인 수정**: `assets/css/style.css`에서 색상과 스타일을 변경하세요.
- **메트릭 설정**: `.github/workflows/metrics.yml` 파일에서 플러그인을 추가하거나 설정을 변경할 수 있습니다.
