import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import {SFC} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Sketch from '../app/style/SketchVariables';
import {generateTrackNavClick} from '../lib/gaHelper';
import {fixedWidthImage} from '../lib/imageKitHelpers';

const logoImgSrc = 'https://ik.imagekit.io/vitaglab/baribuilder-logo-beta-white_ry91QeWtQ.png';

const PaddedImg = styled.img`
  height: 90%;
  padding: 8px;
`;

const GridWithRaisedBackground = styled(Grid)`
  background-color: ${Sketch.color.accent.black};
  box-shadow: 0px 2px 4px 0px;
  height: 64px;
`;

const WhiteNavButton = styled(Button)`
  && {
    color: ${Sketch.color.accent.white};
  }
`;

const HeaderPure: SFC = () => {
  return (
    <GridWithRaisedBackground container spacing={8}>
      <Grid item xs={6}>
        <Link to='/' onClick={generateTrackNavClick('Header image')}>
          <PaddedImg src={fixedWidthImage(logoImgSrc, '400px')} alt='BariBuilder Logo'/>
        </Link>
      </Grid>
      <Grid item xs={6} container alignItems='center' justify='flex-end'>
        <Grid item>
          <Link to='/builder' onClick={generateTrackNavClick('Browse nav')}>
            <WhiteNavButton fullWidth>
              Browse
            </WhiteNavButton>
          </Link>
        </Grid>
        <Grid item>
          <Link to='/builder?openMyRegimen=true' onClick={generateTrackNavClick('Build nav')}>
            <WhiteNavButton fullWidth>
              Build
            </WhiteNavButton>
          </Link>
        </Grid>
      </Grid>
    </GridWithRaisedBackground>
  )
};

export default HeaderPure;