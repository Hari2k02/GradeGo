import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, CardActionArea, CardMedia, Typography } from '@mui/material';

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
        <RootContainer>
            <HeadingTypography variant="h2" component="h1">
                Role Selection
            </HeadingTypography>
            <CardContainer>
                <CustomCard onClick={() => handleRoleSelection('tutor')}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="Tutor"
                            height="300"
                            image="/assets/images/avatars/avatar_1.jpg"
                        />
                        <RoleText variant="h5" component="h2">
                            Tutor
                        </RoleText>
                    </CardActionArea>
                </CustomCard>
                <CustomCard onClick={() => handleRoleSelection('staff-advisor')}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="Staff Advisor"
                            height="300"
                            image="/assets/images/avatars/avatar_2.jpg"
                        />
                        <RoleText variant="h5" component="h2">
                            Staff Advisor
                        </RoleText>
                    </CardActionArea>
                </CustomCard>
            </CardContainer>
            <PromptTypography variant="h3" component="h1">
                Please select a role to continue 
            </PromptTypography>
        </RootContainer>
    );
};

export default RoleSelectionPage;
