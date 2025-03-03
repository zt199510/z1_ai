import React from 'react';
import { Layout, Typography, Row, Col, Divider, Space, Button } from 'antd';
import { 
    ThunderboltOutlined, 
    ApiOutlined, 
    CloudServerOutlined, 
    SafetyCertificateOutlined,
    RocketOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { Flexbox } from 'react-layout-kit';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeatureCard from '../../components/ui/Cards/FeatureCard';
import TechStackCard from '../../components/ui/Cards/TechStackCard';
import MilestoneCard from '../../components/ui/Cards/MilestoneCard';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

export default function ComponentsPage() {
    const navigate = useNavigate();

    // 示例数据
    const featureExamples = [
        {
            title: '多渠道支持',
            description: '除OpenAI外，支持多种AI对话模型接入，灵活配置不同渠道',
            icon: <ApiOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
            color: '#e6f7ff'
        },
        {
            title: '企业级架构',
            description: '基于.NET构建的高性能后端，采用企业级设计模式和最佳实践',
            icon: <CloudServerOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
            color: '#f6ffed'
        }
    ];

    const techStackExamples = [
        {
            title: '后端技术',
            icon: <RocketOutlined style={{ color: '#1890ff' }} />,
            items: ['.NET Core', 'Entity Framework', 'Redis'],
            color: 'blue'
        },
        {
            title: '前端技术',
            icon: <ThunderboltOutlined style={{ color: '#52c41a' }} />,
            items: ['React', 'Ant Design', 'TypeScript'],
            color: 'green'
        }
    ];

    const milestoneExamples = [
        {
            title: '初始版本发布',
            description: '支持对话，支持自定义模型，支持多渠道接入',
            time: '2025 Q1',
            color: 'green'
        },
        {
            title: '企业版发布',
            description: '支持企业级部署，支持多用户管理，支持权限控制',
            time: '2025 Q3',
            color: 'blue'
        }
    ];

    return (
        <Layout style={{ background: '#fff' }}>
            <Flexbox align="flex-start" padding={24}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button 
                        type="primary"
                        shape="round"
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate('/')}
                        style={{ 
                            fontSize: '16px', 
                            padding: '6px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)'
                        }}
                    >
                        返回首页
                    </Button>
                </motion.div>
            </Flexbox>
            <Content>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Title level={1} style={{ marginBottom: 24, textAlign: 'center' }}>
                            组件库展示
                        </Title>
                        <Paragraph style={{
                            fontSize: 18,
                            color: '#666',
                            maxWidth: 800,
                            margin: '0 auto 48px',
                            textAlign: 'center'
                        }}>
                            这个页面展示了我们创建的可复用组件，方便在不同页面中使用
                        </Paragraph>
                    </motion.div>

                    {/* FeatureCard 组件展示 */}
                    <div style={{ marginBottom: 64 }}>
                        <Title level={2} style={{ marginBottom: 24 }}>
                            FeatureCard 组件
                        </Title>
                        <Paragraph style={{ marginBottom: 32 }}>
                            用于展示产品或服务的核心特性，包含图标、标题和描述，带有动画效果。
                        </Paragraph>
                        <Row gutter={[24, 24]}>
                            {featureExamples.map((feature, index) => (
                                <Col xs={24} sm={12} key={index}>
                                    <FeatureCard
                                        title={feature.title}
                                        description={feature.description}
                                        icon={feature.icon}
                                        color={feature.color}
                                        index={index}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Divider />
                        <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>使用方法</Title>
                        <div style={{ 
                            background: '#f5f5f5', 
                            padding: 16, 
                            borderRadius: 8,
                            fontFamily: 'monospace',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ margin: 0 }}>
{`import FeatureCard from '../components/ui/FeatureCard';

<FeatureCard
  title="标题"
  description="描述文本"
  icon={<IconComponent />}
  color="#背景色"
  index={索引} // 可选，用于控制动画延迟
/>`}
                            </pre>
                        </div>
                    </div>

                    {/* TechStackCard 组件展示 */}
                    <div style={{ marginBottom: 64 }}>
                        <Title level={2} style={{ marginBottom: 24 }}>
                            TechStackCard 组件
                        </Title>
                        <Paragraph style={{ marginBottom: 32 }}>
                            用于展示技术栈或分类标签，支持多个标签项，带有动画效果。
                        </Paragraph>
                        <Row gutter={[24, 24]}>
                            {techStackExamples.map((stack, index) => (
                                <Col xs={24} sm={12} key={index}>
                                    <TechStackCard
                                        title={stack.title}
                                        icon={stack.icon}
                                        items={stack.items}
                                        color={stack.color}
                                        index={index}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Divider />
                        <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>使用方法</Title>
                        <div style={{ 
                            background: '#f5f5f5', 
                            padding: 16, 
                            borderRadius: 8,
                            fontFamily: 'monospace',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ margin: 0 }}>
{`import TechStackCard from '../components/ui/TechStackCard';

<TechStackCard
  title="标题"
  icon={<IconComponent />}
  items={['标签1', '标签2', '标签3']}
  color="blue" // 支持 'blue', 'green', 'magenta' 等颜色
  index={索引} // 可选，用于控制动画延迟
/>`}
                            </pre>
                        </div>
                    </div>

                    {/* MilestoneCard 组件展示 */}
                    <div style={{ marginBottom: 64 }}>
                        <Title level={2} style={{ marginBottom: 24 }}>
                            MilestoneCard 组件
                        </Title>
                        <Paragraph style={{ marginBottom: 32 }}>
                            用于展示里程碑或时间线事件，包含标题、描述和时间标签，带有动画效果。
                        </Paragraph>
                        <Space direction="vertical" size={24} style={{ width: '100%' }}>
                            {milestoneExamples.map((milestone, index) => (
                                <MilestoneCard
                                    key={index}
                                    title={milestone.title}
                                    description={milestone.description}
                                    time={milestone.time}
                                    color={milestone.color}
                                />
                            ))}
                        </Space>
                        <Divider />
                        <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>使用方法</Title>
                        <div style={{ 
                            background: '#f5f5f5', 
                            padding: 16, 
                            borderRadius: 8,
                            fontFamily: 'monospace',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ margin: 0 }}>
{`import MilestoneCard from '../components/ui/MilestoneCard';

<MilestoneCard
  title="标题"
  description="描述文本"
  time="时间标签"
  color="green" // 标签颜色
/>`}
                            </pre>
                        </div>
                    </div>
                </div>
            </Content>
        </Layout>
    );
} 