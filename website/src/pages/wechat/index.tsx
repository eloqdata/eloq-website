import React from "react";
import Layout from "@theme/Layout";
import "./wechat.css";

const WechatPage: React.FC = () => {
  return (
    <Layout title="加入微信用户组">
      <div className="wechat-container">
        <div className="wechat-content">
          <h1>加入微信用户组</h1>
          <p className="description">
            欢迎加入 EloqKV
            微信交流群，与社区成员共同探讨使用中的难题。同时，群内还将发布
            EloqKV 的版本更新、活动信息等最新动态。
          </p>
          <p className="instruction">
            请使用微信扫描下方二维码，并发送"公司-姓名-加入 EloqKV
            用户组"完成添加。
          </p>
          <div className="qr-code">
            <img src="/img/community/wechat_invite.png" alt="WeChat QR Code" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WechatPage;
