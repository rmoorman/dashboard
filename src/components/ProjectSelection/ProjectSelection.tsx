import * as React from 'react'
import { Link } from 'react-router'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import { Project } from '../../types/types'
import styled from 'styled-components'
import * as cx from 'classnames'
import {particles, variables, Icon} from 'graphcool-styles'

interface Props {
  params: any
  add: () => void
  selectedProject: Project
  projects: Project[]
}

interface State {
  expanded: boolean,
}

export default class ProjectSelection extends React.Component<Props, State> {

  state = {
    expanded: false,
  }

  shouldComponentUpdate: any

  constructor (props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  _toggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  _onSelectProject = () => {
    this._toggle()

    analytics.track('sidenav: selected project')
  }

  render () {

    const expandedRoot = `
      background: ${variables.green} !important  
    `

    const Root = styled.div`
      &:hover {
        
      }
      ${props => props.expanded && expandedRoot}

    `

    const turnedArrow = `
      transform: rotate(180deg);
      background: ${variables.gray20};
      svg {
        position: relative;
        top: 1px;
      }
    `

    const Arrow = styled.div`
      svg {
        stroke: ${variables.white};
        stroke-width: 4px;
      }
            
      ${props => props.turned && turnedArrow }
    `

    const SettingsLink = styled.div`
      padding: ${variables.size10};
      background: ${variables.gray10};
      font-size: ${variables.size14};
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
      color: ${variables.white60};
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 2px;
      transition: color ${variables.duration} linear, background ${variables.duration} linear;
      
      svg {
        fill: ${variables.white60};
        transition: fill ${variables.duration} linear;
      }
      
      > div {
        margin-left: 10px;
      }
      
      &:hover {
        color: ${variables.white};
        background: ${variables.gray20};
        
        svg {
          fill: ${variables.white};
        }
      }
    `

    const activeListItem = `
      color: ${variables.white};
    
      &:before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: ${variables.size06};
        background: ${variables.white};
        border-radius: 0 2px 2px 0;
      }
    `

    const ListItem = styled(Link)`
      transition: color ${variables.duration} linear;
      
      svg {
        display: none;
        fill: ${variables.white};
      }
      
      &:hover {
        color: ${variables.white};
        
        svg {
          display: block;
        }
      }
      
      ${props => props.active && activeListItem}
    `

    const AddProject = styled.div`
      margin: -3px -4px 0 0;
    
      svg {
        stroke: ${variables.white};
        stroke-width: 4px;
      }
    `

    return (
      <Root
        expanded={this.state.expanded}
        className={cx(
          particles.relative,
          particles.w100,
          particles.h100,
          particles.white,
          particles.z5,
          particles.bgDarkBlue,
        )}
      >
        <div
          onClick={this._toggle}
          className={cx(
            particles.h100,
            particles.w100,
            particles.f20,
            particles.flex,
            particles.itemsCenter,
          )}
        >
          <div
            className={cx(
              particles.bgGreen,
              particles.flex,
              particles.itemsCenter,
              particles.justifyCenter,
            )}
            style={{
              width: '67px',
              height: '67px',
              borderBottomRightRadius: '2px',
            }}
          >
            <Icon
              width={30}
              height={35}
              src={require('assets/icons/logo.svg')}
              color='#fff'
            />
          </div>
          <div
            className={cx(
              particles.flex,
              particles.justifyBetween,
              particles.selfStretch,
              particles.itemsCenter,
              particles.ph25,
              particles.pointer,
            )}
            style={{
              flexGrow: 2,
            }}
          >
            <div>
              {this.props.selectedProject.name}
            </div>
            <Arrow
              turned={this.state.expanded}
              className={cx(
                particles.flex,
                particles.itemsCenter,
                particles.brPill,
              )}
              style={{
                marginRight: '-3px',
              }}
            >
              <Icon
                width={18}
                height={18}
                stroke
                src={require('graphcool-styles/icons/stroke/arrowDown.svg')}
              />
            </Arrow>
          </div>

        </div>
        {this.state.expanded &&
          <div
            className={cx(
              particles.absolute,
              particles.w100,
              particles.vh100,
              particles.bgGreen,
              particles.flex,
              particles.flexColumn,

            )}
          >

            <div className={cx(
              particles.pa25,
              particles.flex,
              particles.justifyBetween,
            )}>
              <SettingsLink>
                <Icon width={16} height={16} src={require('graphcool-styles/icons/fill/settings.svg')}/>
                <div>Settings</div>
              </SettingsLink>
              <SettingsLink className={cx(particles.ml10)}>
                <Icon width={16} height={16} src={require('graphcool-styles/icons/fill/user.svg')}/>
                <div>Account</div>
              </SettingsLink>
            </div>
            <div
              className={cx(
                particles.relative,
                particles.bgBlack07,

              )}
              style={{
                flexGrow: 2,
              }}
            >
              <ScrollBox>
                <div className={cx(
                particles.lhSolid,
                particles.flex,
                particles.itemsCenter,
                particles.tracked,
                particles.ttu,
                particles.fw6,
                particles.white80,
                particles.mt38,
                particles.ml25,
                particles.mb16,
              )}>
                  All Projects
                </div>
                {this.props.projects.map((project) => (
                  <ListItem
                    key={project.name}
                    className={cx(
                    particles.relative,
                    particles.db,
                    particles.f20,
                    particles.fw4,
                    particles.ph25,
                    particles.pv16,
                    particles.white60,
                    particles.flex,
                    particles.justifyBetween,
                    particles.itemsCenter,
                  )}
                    onClick={this._onSelectProject}
                    to={`/${project.name}`}
                    active={true}
                  >
                    <div className={cx(particles.ml10)}>{project.name}</div>
                    <div title='Duplicate'>
                      <Icon
                        src={require('graphcool-styles/icons/fill/duplicate.svg')}
                      />
                    </div>
                  </ListItem>
                ))}
                <AddProject
                  className={cx(
                  particles.absolute,
                  particles.top38,
                  particles.right25,
                  particles.lhSolid,
                  particles.ba,
                  particles.brPill,
                  particles.bWhite,
                  particles.pointer,
                  particles.o80
                )}
                  onClick={this.props.add}
                >
                  <Icon width={18} height={18} stroke src={require('graphcool-styles/icons/stroke/add.svg')}/>
                </AddProject>
              </ScrollBox>
            </div>

          </div>
        }
      </Root>
    )
  }
}
