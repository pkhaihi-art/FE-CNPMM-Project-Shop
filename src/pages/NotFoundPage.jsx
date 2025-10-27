import { Button, Flex, Space, Typography } from 'antd' // Import AntD components
import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { notFoundPageAnimation } from '../assets'
import Lottie from 'lottie-react'

const { Title, Text } = Typography // Destructure Typography components

export const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    // Ersetzt den äußeren Stack
    <Flex 
      justify={'center'} 
      align={'center'} 
      style={{ height: '100vh' }}
    >
      {/* Ersetzt den inneren Stack, 'vertical' für vertikale Ausrichtung */}
      <Flex vertical justify={'center'} align={'center'} gap="middle"> 
        
        {/* Lottie-Container, ersetzt Stack */}
        <div style={{ width: '25rem' }}>
            <Lottie animationData={notFoundPageAnimation}/>
        </div>
        
        {/* Ersetzt den Text-Stack */}
        <Flex vertical align={'center'}>
            {/* Ersetzt Typography variant='h4' */}
            <Title level={3} style={{ fontWeight: 500, margin: 0 }}>
              {t('not_found_title')}
            </Title>
            <Text type="secondary" style={{ fontSize: '1.1rem', fontWeight: 300 }}>
              {t('not_found_description')}
            </Text>
        </Flex>

        {/* Ersetzt Button */}
        <Link to={'/'}>
            <Button 
              type='primary'
              size='large'
              style={{ marginTop: 24 }}
            >
              {t('go_back_home')}
            </Button>
        </Link>
      </Flex>
    </Flex>
  )
}