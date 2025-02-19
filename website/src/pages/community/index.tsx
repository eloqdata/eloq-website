import React from "react";
import Layout from "@theme/Layout";
import "./community.css";

// 删除之前的图标导入

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="64"
    height="64"
    fill="currentColor"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const WechatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="64"
    height="64"
    fill="currentColor"
  >
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098c.93.265 1.93.411 2.977.411 4.8 0 8.691-3.288 8.691-7.342 0-4.053-3.89-7.343-8.691-7.343zm12.31 11.312c1.833-1.347 3-3.338 3-5.55 0-4.054-3.89-7.343-8.691-7.343-4.8 0-8.691 3.289-8.691 7.343 0 4.054 3.89 7.342 8.691 7.342 1.047 0 2.047-.146 2.977-.411a.864.864 0 01.717.098l1.903 1.114a.326.326 0 00.167.054c.16 0 .29-.132.29-.295 0-.072-.029-.143-.048-.213l-.39-1.48a.59.59 0 01.213-.665" />
  </svg>
);

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="64"
    height="64"
    fill="currentColor"
  >
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </svg>
);

const CommunityPage: React.FC = () => {
  return (
    <Layout title="社区">
      <div className="community-container">
        <div className="community-content">
          <section className="help-section">
            <h1>如何在社区得到／提供帮助？</h1>

            <div className="community-channels">
              <div className="channel-card">
                <div className="channel-icon">
                  <GithubIcon />
                </div>
                <h3>GitHub Discussions</h3>
                <p>
                  在这里就 EloqKV 的使用提出问题参与讨论，搜索所有历史讨论。
                </p>
                <a
                  href="https://github.com/eloqdata/eloqkv/discussions"
                  className="channel-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  访问 Github Discussions →
                </a>
              </div>

              <div className="channel-card">
                <div className="channel-icon">
                  <WechatIcon />
                </div>
                <h3>微信用户群</h3>
                <p>
                  如果你对产品使用有任何问题，或者是想和其他使用者交流，请加入我们的微信用户群。
                </p>
                <a href="/contact" className="channel-link">
                  加入微信群 →
                </a>
              </div>

              <div className="channel-card">
                <div className="channel-icon">
                  <ShareIcon />
                </div>
                <h3>分享你的使用心得</h3>
                <p>欢迎通过主题演讲或者博客的形式来分享使用 EloqKV 的经验。</p>
                <a href="/contact" className="channel-link">
                  联系我们 →
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
