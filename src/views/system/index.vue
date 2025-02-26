<template>
    <div id="app">
      <header>
        <h1>软件产品介绍</h1>
        <p>简洁、高效、易用的解决方案</p>
      </header>
  
      <div class="container">
        <section>
          <h2>产品概述</h2>
          <p>我们的软件产品旨在为用户提供高效、便捷的解决方案，帮助您轻松应对各种挑战。无论是个人用户还是企业客户，我们的产品都能满足您的需求。</p>
        </section>
  
        <section>
          <h2>主要功能</h2>
          <div class="feature" v-for="(feature, index) in features" :key="index">
            <img :src="feature.image" :alt="feature.alt">
            <div class="feature-text">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </section>
  
        <section>
          <h2>立即体验</h2>
          <p>现在就下载我们的软件，体验高效、智能的工作方式。</p>
          <a href="#" class="cta-button" @click.prevent="downloadSoftware">免费下载</a>
        </section>
      </div>
  
      <footer>
        <p>&copy; 2023 软件公司. 保留所有权利.</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: "App",
    data() {
      return {
        features: [
          {
            image: "https://via.placeholder.com/300",
            alt: "功能1",
            title: "功能一：高效处理",
            description: "我们的软件能够快速处理大量数据，确保您的工作流程顺畅无阻。无论是数据分析还是任务管理，都能轻松应对。"
          },
          {
            image: "https://via.placeholder.com/300",
            alt: "功能2",
            title: "功能二：智能分析",
            description: "通过先进的算法和机器学习技术，我们的软件能够智能分析数据，为您提供精准的决策支持。"
          },
          {
            image: "https://via.placeholder.com/300",
            alt: "功能3",
            title: "功能三：用户友好",
            description: "简洁直观的用户界面设计，让您无需复杂的学习过程即可轻松上手，提升工作效率。"
          }
        ]
      };
    },
    methods: {
      downloadSoftware() {
        alert("点击了下载按钮，可以在这里处理下载逻辑！");
      }
    }
  };
  </script>
  
  <style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f9f9f9;
    color: #333;
  }
  header {
    background-color: #4CAF50;
    color: white;
    padding: 20px 0;
    text-align: center;
  }
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  h1, h2 {
    color: #4CAF50;
  }
  p {
    margin-bottom: 20px;
  }
  .feature {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
  .feature img {
    max-width: 300px;
    margin-right: 20px;
    border-radius: 10px;
  }
  .feature-text {
    flex: 1;
  }
  .cta-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
    margin-top: 20px;
  }
  .cta-button:hover {
    background-color: #45a049;
  }
  footer {
    text-align: center;
    padding: 20px;
    background-color: #333;
    color: white;
    margin-top: 40px;
  }
  </style>