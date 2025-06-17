import * as React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import "./styles.css";
import { Link } from "react-router-dom";
import LocalStorageWatcher from '../../store/localStorageWatcher';
import { AuthStore } from '../../store/index';
import { logout, findById } from "./api";
import Header from "./components/header";
import UserIcon from "./components/user-icon";
import logo from '../../assets/img/logo.png';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      preloader: true,
      loadingItem: null,
      user: {
        name: '',
        email: '',
        imageUrl: '',
      },
      navigation: [
        {
          name: 'Tablero',
          href: '/dashboard',
          current: true,
          children: []
        },
        {
          name: 'Mis formularios',
          href: '#',
          current: false,
          children: [
            {
              name: 'Mis Formularios',
              href: '/forms/viewer',
              current: false,
            },
            {
              name: 'Crear uno Nuevo',
              href: '/forms/create',
              current: false,
            }
          ]
        },
        /*{
          name: 'Plantillas',
          href: '#',
          current: false,
          children: []
        },
        {
          name: 'Reportes',
          href: '#',
          current: false,
          children: []
        },*/
      ],
      userNavigation: [
        { name: 'Mi cuenta', href: '/profile/edit' },
        //{ name: 'Opciones', href: '#' },
        { name: 'Salir', href: '#', onClick: logout },
      ],
      mobileSubmenusOpen: {},
    };
    this.checkDocumentState = this.checkDocumentState.bind(this);
    this.handleClickOpenNav = this.handleClickOpenNav.bind(this);
    this.detectChangesStorage = this.detectChangesStorage.bind(this);
    this.goToAuth = this.goToAuth.bind(this);
    this.handleToggleMobileSubmenu = this.handleToggleMobileSubmenu.bind(this);
  }

  componentDidMount() {
    this.checkDocumentState();
    this.localStorageWatcher = new LocalStorageWatcher(this.detectChangesStorage);
    this.goToAuth();

  }

  componentWillUnmount() {
    document.removeEventListener('load', () => this.setState({ preloader: false }));
  }

  checkDocumentState = () => {
    if (document.readyState === "complete") {
      this.setState({ preloader: false });
      findById().then(res => {
        this.setState({
          user: {
            name: res.data.firstName,
            email: res.data.email,
            imageUrl:
              '',
          }
        });
      });
    } else {
      window.addEventListener('load', () => this.setState({ preloader: false }));
    }
  }

  handleClickOpenNav = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      const navbarNavDropdown = document.getElementById("navbarResponsive");
      navbarNavDropdown.classList.toggle("show");
    }
  }

  goToAuth() {
    if (!AuthStore.getState().isAuthenticated) {
      window.location.replace('/auth/login');
    }
  }

  detectChangesStorage(event) {
    this.goToAuth();
  }

  // Nueva función para alternar submenús en móvil
  handleToggleMobileSubmenu(idx) {
    this.setState((prev) => ({
      mobileSubmenusOpen: {
        ...prev.mobileSubmenusOpen,
        [idx]: !prev.mobileSubmenusOpen[idx]
      }
    }));
  }

  render() {
    const { navigation, user, userNavigation, mobileSubmenusOpen } = this.state;
    const { children } = this.props;
    return (
      <>
        <div className="min-h-full min-h-screen">
          <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="flex lg:flex-1 items-center">
                      <a href="#" className="-m-1.5 p-1.5 flex items-center">
                        <span className="sr-only">QuestionAsk</span>
                        <img
                          alt="QuestionAsk"
                          src={logo}
                          className="h-16 w-auto max-w-none"
                        />
                      </a>
                    </div>
                  </div>

                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        item.children && item.children.length > 0 ? (
                          <Menu key={item.name} as="div" className="relative inline-block text-left">
                            <div>
                              <MenuButton
                                className={classNames(
                                  item.current
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600',
                                  'inline-flex justify-center w-full px-3 py-2 text-sm font-medium rounded-md'
                                )}
                              >
                                {item.name}
                                <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                              </MenuButton>
                            </div>

                            <MenuItems
                              transition
                              className="absolute left-0 z-50 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                {item.children.map((child) => (
                                  <MenuItem key={child.name}>
                                    {({ active }) => (
                                      <Link
                                        to={child.href}
                                        className={classNames(
                                          active ? 'bg-gray-100 text-indigo-600' : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                        )}
                                      >
                                        {child.name}
                                      </Link>
                                    )}
                                  </MenuItem>
                                ))}
                              </div>
                            </MenuItems>
                          </Menu>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                          >
                            {item.name}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/*
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon aria-hidden="true" className="size-6" />
                    </button>
                     */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          {/*<img alt="" src={user.imageUrl} className="size-8 rounded-full" />*/}
                          <UserIcon></UserIcon>
                        </MenuButton>
                      </div>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                      >
                        {userNavigation.map((item) => (
                          <MenuItem key={item.name}>
                            <Link
                              to={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                              onClick={async (e) => {
                                e.preventDefault();
                                this.setState({
                                  loadingItem: item.name
                                });
                                try {
                                  await item.onClick?.();
                                } finally {
                                  this.setState({
                                    loadingItem: null
                                  });
                                  window.location.href = item.href;
                                }
                              }}
                            >
                              {this.state.loadingItem === item.name ? 'Cargando...' : item.name}
                            </Link>
                          </MenuItem>
                        ))}
                      </MenuItems>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile menu panel */}
            <DisclosurePanel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map((item, idx) => (
                  item.children && item.children.length > 0 ? (
                    <div key={item.name} className="">
                      <button
                        type="button"
                        className={classNames(
                          'flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium focus:outline-none transition',
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        )}
                        onClick={() => this.handleToggleMobileSubmenu(idx)}
                        aria-expanded={!!mobileSubmenusOpen[idx]}
                        aria-controls={`mobile-submenu-${idx}`}
                      >
                        <span>{item.name}</span>
                        {mobileSubmenusOpen[idx] ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        )}
                      </button>
                      <div
                        id={`mobile-submenu-${idx}`}
                        className={classNames(
                          'pl-6 transition-all duration-200',
                          mobileSubmenusOpen[idx] ? 'block py-1' : 'hidden'
                        )}
                      >
                        {item.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                      )}
                    >
                      {item.name}
                    </a>
                  )
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="shrink-0">
                    {/*<img alt="" src={user.imageUrl} className="size-10 rounded-full" />*/}
                    <UserIcon></UserIcon>
                  </div>
                  <div className="ml-3">
                    <div className="text-base/5 font-medium text-white">{user.name || "jose"}</div>
                    <div className="text-sm font-medium text-gray-400">{user.email || "email"}</div>
                  </div>
                  {/*<button
                    type="button"
                    className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button> */}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      onClick={async (e) => {
                        e.preventDefault();
                        this.setState({
                          loadingItem: item.name
                        });
                        try {
                          await item.onClick?.();
                        } finally {
                          this.setState({
                            loadingItem: null
                          });
                          window.location.href = item.href;
                        }
                      }}
                    >
                      {this.state.loadingItem === item.name ? 'Cargando...' : item.name}
                    </DisclosureButton>
                  ))}
                </div>
              </div>
            </DisclosurePanel>
          </Disclosure>

          <Header title={this.props.title}></Header>
          <main>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </>
    );
  }
}

export default Layout;