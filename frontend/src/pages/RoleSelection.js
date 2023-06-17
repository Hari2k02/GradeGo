import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardMedia, Typography } from '@mui/material';
import { motion } from 'framer-motion'
import { staggerContainer, fadeIn, slideIn } from '../utils/motion'

const RootContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
});

const HeadingTypography = styled(Typography)({
    textAlign: 'center',
    marginBottom: '3rem',
    marginTop: '1rem',
});

const PromptTypography = styled(Typography)({
    textAlign: 'center',
    marginBottom: '2rem',
    marginTop: '2rem',
});
const CardContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10rem',
});

const CustomCard = styled(Card)({
    width: 300,
    height: 400,
    margin: '1rem',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.1)',
        outline: '2px solid blue',
    },
});

const RoleText = styled(Typography)({
    textAlign: 'center',
    marginTop: '1rem',
});

const RoleSelectionPage = () => {
    const navigate = useNavigate();

    const handleRoleSelection = (role) => {
        if (role === 'tutor') {
            navigate('/tutordashboard');
        } else if (role === 'staff-advisor') {
            navigate('/dashboard');
        }
    };

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}>
            <RootContainer>
                <motion.div variants={slideIn("up", "tween", 0, 1)}>
                <HeadingTypography variant="h2" component="h1">
                    Role Selection
                </HeadingTypography>
                </motion.div>
                <CardContainer>
                    <motion.div variants={fadeIn("right", "tween", 0.3, 1)}>
                        <CustomCard onClick={() => handleRoleSelection('tutor')}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    alt="Tutor"
                                    height="300"
                                    image="/assets/images/avatars/teacher.jpg"
                                />
                                <RoleText variant="h5" component="h2">
                                    Tutor
                                </RoleText>
                            </CardActionArea>
                        </CustomCard>
                    </motion.div>
                    <motion.div variants={fadeIn("left", "tween", 0.3, 1)}>
                    <CustomCard onClick={() => handleRoleSelection('staff-advisor')}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                alt="Staff Advisor"
                                height="300"
                                image="/assets/images/avatars/advisor.jpg"
                            />
                            <RoleText variant="h5" component="h2">
                                Staff Advisor
                            </RoleText>
                        </CardActionArea>
                    </CustomCard>
                    </motion.div>
                </CardContainer>
                <motion.div variants={slideIn("up", "tween", 0, 1)}>
                <PromptTypography variant="h3" component="h1">
                    Please select a role to continue
                </PromptTypography>
                </motion.div>
            </RootContainer>
        </motion.div>
    );
};

export default RoleSelectionPage;
